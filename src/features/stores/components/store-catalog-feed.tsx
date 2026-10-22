'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { ModelCard } from '@/components/products/model-card';
import { Icons } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
import { publicApiRequest } from '@/lib/api/client';
import { mapProductsResponse } from '@/lib/api/mappers';
import { resolveStoreWhatsAppNumber } from '@/lib/formatters';
import { filterModelsForCatalog } from '@/features/stores/lib/filter-catalog-models';
import type { StoreCatalogFeedProps, StoreCatalogFilters } from '@/types/store';
import type { StoreProductListItem, StoreProductDetail } from '@/types/product';
import type { ApiPaginatedProducts } from '@/types/api';

const ProductDetailModal = dynamic(
  () =>
    import('@/components/products/product-detail-modal').then((mod) => mod.ProductDetailModal),
  { ssr: false }
);

async function fetchProductsPage(
  slug: string,
  filters: StoreCatalogFilters,
  page: number
) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.category) params.set('category', filters.category);
  if (filters.inStock) params.set('inStock', 'true');
  params.set('page', String(page));
  params.set('limit', String(PRODUCTS_PAGE_SIZE));
  const raw = await publicApiRequest<ApiPaginatedProducts>(
    `stores/${slug}/products?${params.toString()}`,
    { cache: 'no-store' }
  );
  return mapProductsResponse(raw);
}

export function StoreCatalogFeed({
  store,
  initialProducts,
  allModels,
  productsTotal,
  productsPage: initialPage,
  productsTotalPages,
  filters,
  isFilterPending = false
}: StoreCatalogFeedProps) {
  const t = useTranslations();
  const [selectedProduct, setSelectedProduct] = useState<StoreProductDetail | null>(null);
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(productsTotal);
  const [hasMore, setHasMore] = useState(initialPage < productsTotalPages);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setProducts(initialProducts);
    setPage(initialPage);
    setTotal(productsTotal);
    setHasMore(initialPage < productsTotalPages);
    setLoadError(false);
    loadingRef.current = false;
  }, [initialProducts, initialPage, productsTotal, productsTotalPages, filters.category, filters.q]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || isFilterPending) return;
    loadingRef.current = true;
    setLoadingMore(true);
    setLoadError(false);

    const nextPage = page + 1;
    const response = await fetchProductsPage(store.slug, filters, nextPage);

    if (!response) {
      setLoadError(true);
      setLoadingMore(false);
      loadingRef.current = false;
      return;
    }

    setProducts((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      const appended = response.items.filter((p) => !seen.has(p.id));
      return [...prev, ...appended];
    });
    setPage(response.page);
    setTotal(response.total);
    setHasMore(response.page < response.totalPages);
    setLoadingMore(false);
    loadingRef.current = false;
  }, [filters, hasMore, isFilterPending, page, store.slug]);

  const handleRetryLoadMore = () => {
    loadingRef.current = false;
    void loadMore();
  };

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isFilterPending) return;

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
  }, [hasMore, isFilterPending, loadMore]);

  const visibleModels = useMemo(
    () => filterModelsForCatalog(allModels, products, filters),
    [allModels, products, filters]
  );

  const accessoryProducts = useMemo(
    () => products.filter((p) => p.trackingType !== 'SERIALIZED'),
    [products]
  );

  const handleSelectProduct = (product: StoreProductListItem) => {
    const detail: StoreProductDetail = {
      ...product,
      description: null,
      images: product.primaryImageUrl
        ? [{ id: '1', url: product.primaryImageUrl, sortOrder: 0 }]
        : []
    };
    setSelectedProduct(detail);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const showEmpty =
    !isFilterPending &&
    visibleModels.length === 0 &&
    accessoryProducts.length === 0 &&
    !loadingMore;

  if (isFilterPending) {
    return (
      <div className='space-y-3'>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <p className='text-xs text-muted-foreground'>
        {t('stores.productsAvailable', { count: total })}
      </p>

      {visibleModels.length > 0 ? (
        <section className='space-y-3' aria-labelledby='phone-models-heading'>
          <h3
            id='phone-models-heading'
            className='text-sm font-semibold tracking-tight text-foreground'
          >
            {t('catalog.phoneModels')}
          </h3>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
            {visibleModels.map((model, index) => (
              <ModelCard
                key={`${model.key}-${index}`}
                model={model}
                storeSlug={store.slug}
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      ) : null}

      {accessoryProducts.length > 0 ? (
        <ProductGrid
          products={accessoryProducts}
          storeSlug={store.slug}
          storeName={store.displayName}
          storePhone={resolveStoreWhatsAppNumber(store)}
          onSelectProduct={handleSelectProduct}
        />
      ) : null}

      {showEmpty ? (
        <div className='flex flex-col items-center justify-center space-y-3 py-16 text-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
            <Icons.mobile className='h-7 w-7' />
          </div>
          <h3 className='text-base font-semibold text-foreground'>{t('catalog.noProducts')}</h3>
        </div>
      ) : null}

      <div
        ref={sentinelRef}
        className='flex min-h-10 flex-col items-center justify-center gap-2 py-6'
      >
        {loadingMore ? (
          <div
            className='flex items-center gap-2 text-sm text-muted-foreground'
            aria-live='polite'
          >
            <Spinner className='size-4' />
            <span>{t('catalog.loadingMore')}</span>
          </div>
        ) : null}
        {loadError ? (
          <button
            type='button'
            className='cursor-pointer text-sm text-primary underline-offset-4 hover:underline'
            onClick={handleRetryLoadMore}
          >
            {t('catalog.retryLoadMore')}
          </button>
        ) : null}
        {!hasMore &&
        !loadingMore &&
        (visibleModels.length > 0 || accessoryProducts.length > 0) ? (
          <p className='text-xs text-muted-foreground'>{t('catalog.endOfList')}</p>
        ) : null}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        storeName={store.displayName}
        storePhone={resolveStoreWhatsAppNumber(store)}
        onClose={handleCloseModal}
      />
    </div>
  );
}
