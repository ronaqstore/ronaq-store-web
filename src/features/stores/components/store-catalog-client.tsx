'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductGrid } from '@/components/products/product-grid';
import { ModelCard } from '@/components/products/model-card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { StoreCatalogClientProps, StoreCatalogFilters } from '@/types/store';
import type { StoreProductListItem, StoreProductDetail } from '@/types/product';
import { resolveStoreWhatsAppNumber } from '@/lib/formatters';

const ProductDetailModal = dynamic(
  () =>
    import('@/components/products/product-detail-modal').then((mod) => mod.ProductDetailModal),
  { ssr: false }
);

function buildQuery(filters: StoreCatalogFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.q) query.q = filters.q;
  if (filters.category) query.category = filters.category;
  return query;
}

export function StoreCatalogClient({
  store,
  categories,
  products,
  models,
  filters
}: StoreCatalogClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(filters.q);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [selectedProduct, setSelectedProduct] = useState<StoreProductDetail | null>(null);

  useEffect(() => {
    setSearchQuery(filters.q);
  }, [filters.q]);

  const replaceFilters = (next: StoreCatalogFilters) => {
    const query = buildQuery(next);
    startTransition(() => {
      if (Object.keys(query).length > 0) {
        router.replace({ pathname, query }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  };

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === filters.q) return;

    const query = buildQuery({
      q: trimmed,
      category: filters.category,
      inStock: true
    });

    startTransition(() => {
      if (Object.keys(query).length > 0) {
        router.replace({ pathname, query }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  }, [debouncedSearch, filters.q, filters.category, pathname, router]);

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

  return (
    <div className='mx-auto max-w-[1600px] space-y-5 px-4 pb-10 pt-4 sm:space-y-6 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8'>
      <ProductFilters
        categories={categories}
        selectedCategoryId={filters.category}
        searchQuery={searchQuery}
        onCategorySelect={(category) =>
          replaceFilters({
            q: searchQuery.trim(),
            category,
            inStock: true
          })
        }
        onSearchChange={setSearchQuery}
      />

      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        {isPending ? (
          <span className='inline-flex items-center gap-2' aria-busy='true'>
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-12' />
          </span>
        ) : (
          <span>
            {t('stores.productsAvailable', {
              count: products.length + models.length
            })}
          </span>
        )}
      </div>

      {models.length > 0 ? (
        <section className='space-y-3' aria-labelledby='phone-models-heading'>
          <h3
            id='phone-models-heading'
            className='text-sm font-semibold tracking-tight text-foreground'
          >
            {t('catalog.phoneModels')}
          </h3>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
            {models.map((model, index) => (
              <ModelCard
                key={model.key}
                model={model}
                storeSlug={store.slug}
                priority={index < 4}
              />
            ))}
          </div>
        </section>
      ) : null}

      <ProductGrid
        products={products.filter((p) => p.trackingType !== 'SERIALIZED')}
        storeSlug={store.slug}
        storeName={store.displayName}
        storePhone={resolveStoreWhatsAppNumber(store)}
        onSelectProduct={handleSelectProduct}
      />

      <ProductDetailModal
        product={selectedProduct}
        storeName={store.displayName}
        storePhone={resolveStoreWhatsAppNumber(store)}
        onClose={handleCloseModal}
      />
    </div>
  );
}
