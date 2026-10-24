'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { Spinner } from '@/components/ui/spinner';
import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
import { publicApiRequest } from '@/lib/api/client';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import { mapMarketplaceProductsResponse } from '@/lib/api/mappers';
import { toPaisaFromRs } from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import { MarketplaceProductCard } from '@/components/products/marketplace-product-card';
import type {
  ApiPaginatedMarketplaceProducts,
  MarketplaceFeedProps,
  MarketplaceListingFilters,
  MarketplaceProduct
} from '@/types/marketplace';

async function fetchMarketplacePage(
  searchQuery: string,
  modelKey: string | null,
  cityId: string,
  filters: MarketplaceListingFilters,
  page: number
) {
  const params = new URLSearchParams();
  if (modelKey) params.set('modelKey', modelKey);
  else if (searchQuery) params.set('q', searchQuery);
  const city = marketplaceCityQueryParam(cityId);
  if (city) params.set('city', city);
  if (filters.condition) params.set('condition', filters.condition);
  if (filters.minPriceRs != null) {
    params.set('minPrice', String(toPaisaFromRs(filters.minPriceRs)));
  }
  if (filters.maxPriceRs != null) {
    params.set('maxPrice', String(toPaisaFromRs(filters.maxPriceRs)));
  }
  if (filters.inStock === true) params.set('inStock', 'true');
  if (filters.inStock === false) params.set('inStock', 'false');
  if (filters.ptaStatus) params.set('ptaStatus', filters.ptaStatus);
  if (filters.authenticity) params.set('authenticity', filters.authenticity);
  if (filters.sort) params.set('sort', filters.sort);
  params.set('page', String(page));
  params.set('limit', String(PRODUCTS_PAGE_SIZE));
  const raw = await publicApiRequest<ApiPaginatedMarketplaceProducts>(
    `marketplace/products?${params.toString()}`,
    { cache: 'no-store' }
  );
  return mapMarketplaceProductsResponse(raw);
}

export function MarketplaceProductFeed({
  initialProducts,
  total,
  page: initialPage,
  totalPages,
  searchQuery,
  modelKey,
  cityId,
  filters
}: MarketplaceFeedProps) {
  const t = useTranslations();
  const [products, setProducts] = useState<MarketplaceProduct[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialPage < totalPages);
    setLoadError(false);
    loadingRef.current = false;
  }, [initialProducts, initialPage, totalPages, searchQuery, modelKey, cityId, filters]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError(false);

    const nextPage = page + 1;
    const response = await fetchMarketplacePage(
      searchQuery,
      modelKey,
      cityId,
      filters,
      nextPage
    );

    if (!response) {
      setLoadError(true);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    setProducts((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const appended = response.items.filter((p) => !seen.has(p.id));
      return [...prev, ...appended];
    });
    setPage(response.page);
    setHasMore(response.page < response.totalPages);
    setLoading(false);
    loadingRef.current = false;
  }, [cityId, filters, hasMore, modelKey, page, searchQuery]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleRetryLoadMore = () => {
    loadingRef.current = false;
    void loadMore();
  };

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-border p-8 py-16 text-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
          <Icons.mobile className='h-6 w-6' />
        </div>
        <h3 className='text-base font-semibold text-foreground'>
          {t('marketplace.noProductsFound')}
        </h3>
        <p className='text-xs text-muted-foreground'>
          {t('marketplace.productsFound', { count: 0 })}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground'>
        {t('marketplace.productsFound', { count: total })}
      </p>
      <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
        {products.map((product, index) => (
          <MarketplaceProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className={cn(
          'flex flex-col items-center justify-start gap-3 pt-4 pb-8',
          hasMore || loading ? 'min-h-40' : 'min-h-10'
        )}
      >
        {loading ? (
          <div className='w-full space-y-3' aria-live='polite'>
            <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
              <Spinner className='size-4' />
              <span>{t('marketplace.loadingMore')}</span>
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        ) : null}
        {loadError ? (
          <button
            type='button'
            className='cursor-pointer text-sm text-primary underline-offset-4 hover:underline'
            onClick={handleRetryLoadMore}
          >
            {t('marketplace.retryLoadMore')}
          </button>
        ) : null}
        {!hasMore && !loading ? (
          <p className='text-xs text-muted-foreground'>{t('marketplace.endOfList')}</p>
        ) : null}
      </div>
    </div>
  );
}
