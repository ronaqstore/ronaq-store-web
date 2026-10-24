'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { Spinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
import { publicApiRequest } from '@/lib/api/client';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import { mapMarketplaceProductsResponse } from '@/lib/api/mappers';
import { toPaisaFromRs } from '@/lib/marketplace-filters';
import { trackMarketplaceProductsRequest } from '@/lib/marketplace-request-log';
import { formatNumber } from '@/lib/formatters';
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
  page: number,
  signal?: AbortSignal
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
  if (filters.category) params.set('category', filters.category);
  params.set('page', String(page));
  params.set('limit', String(PRODUCTS_PAGE_SIZE));

  const paramRecord: Record<string, string> = {};
  params.forEach((value, key) => {
    paramRecord[key] = value;
  });
  trackMarketplaceProductsRequest('client', paramRecord);

  const raw = await publicApiRequest<ApiPaginatedMarketplaceProducts>(
    `marketplace/products?${params.toString()}`,
    { cache: 'no-store' },
    signal
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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<MarketplaceProduct[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setProducts(initialProducts);
    setPage(initialPage);
    setHasMore(initialPage < totalPages);
    setLoadError(false);
    setLoading(false);
    loadingRef.current = false;
  }, [initialProducts, initialPage, totalPages, searchQuery, modelKey, cityId, filters]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError(false);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const nextPage = page + 1;
    try {
      const response = await fetchMarketplacePage(
        searchQuery,
        modelKey,
        cityId,
        filters,
        nextPage,
        controller.signal
      );

      if (abortRef.current !== controller || controller.signal.aborted) return;

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
    } catch (error: unknown) {
      if (abortRef.current !== controller) return;
      if (error instanceof DOMException && error.name === 'AbortError') {
        setLoading(false);
        loadingRef.current = false;
        return;
      }
      setLoadError(true);
      setLoading(false);
      loadingRef.current = false;
    }
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
      { rootMargin: '600px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleRetryLoadMore = () => {
    loadingRef.current = false;
    void loadMore();
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aIn = a.availability === 'IN_STOCK' ? 0 : 1;
      const bIn = b.availability === 'IN_STOCK' ? 0 : 1;
      return aIn - bIn;
    });
  }, [products]);

  if (products.length === 0) {
    return (
      <EmptyState
        onAction={() => {
          router.replace(pathname, { scroll: false });
        }}
      />
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <p className='text-xs sm:text-sm font-medium text-muted-foreground'>
        {t('marketplace.productsFound', { count: formatNumber(total, locale) })}
      </p>

      <div className='grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 lg:gap-6'>
        {sortedProducts.map((product, index) => (
          <MarketplaceProductCard
            key={product.id}
            product={product}
            priority={index < 4}
            prefetch={false}
          />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className={cn(
          'flex flex-col items-center justify-start gap-3 pt-6 pb-8',
          hasMore || loading ? 'min-h-40' : 'min-h-10'
        )}
      >
        {loading ? (
          <div className='w-full space-y-4' aria-live='polite'>
            <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
              <Spinner className='size-4' />
              <span>{t('marketplace.loadingMore')}</span>
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        ) : null}
        {loadError ? (
          <div className='w-full max-w-md pt-2'>
            <ErrorState onRetry={handleRetryLoadMore} />
          </div>
        ) : null}
        {!hasMore && !loading ? (
          <p className='text-xs sm:text-sm text-muted-foreground'>{t('marketplace.endOfList')}</p>
        ) : null}
      </div>
    </div>
  );
}
