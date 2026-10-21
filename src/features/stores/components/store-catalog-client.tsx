'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { ProductFilters } from '@/components/products/product-filters';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { StoreCatalogClientProps, StoreCatalogFilters } from '@/types/store';
import { StoreCatalogFeed } from './store-catalog-feed';

function buildQuery(filters: StoreCatalogFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.q) query.q = filters.q;
  if (filters.category) query.category = filters.category;
  return query;
}

export function StoreCatalogClient({
  store,
  categories,
  initialProducts,
  allModels,
  productsTotal,
  productsPage,
  productsTotalPages,
  filters
}: StoreCatalogClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(filters.q);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);

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
      inStock: filters.inStock
    });

    startTransition(() => {
      if (Object.keys(query).length > 0) {
        router.replace({ pathname, query }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  }, [debouncedSearch, filters.q, filters.category, filters.inStock, pathname, router]);

  const handleCategorySelect = (category: string) => {
    replaceFilters({
      q: searchQuery.trim(),
      category,
      inStock: filters.inStock
    });
  };

  return (
    <div className='mx-auto max-w-[1600px] space-y-5 px-4 pb-10 pt-4 sm:space-y-6 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8'>
      <ProductFilters
        categories={categories}
        selectedCategoryId={filters.category}
        searchQuery={searchQuery}
        onCategorySelect={handleCategorySelect}
        onSearchChange={setSearchQuery}
      />

      <div className='flex items-center justify-between text-xs text-muted-foreground'>
        {isPending ? (
          <span className='inline-flex items-center gap-2' aria-busy='true'>
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-12' />
            <span className='sr-only'>{t('catalog.loadingMore')}</span>
          </span>
        ) : null}
      </div>

      <StoreCatalogFeed
        store={store}
        initialProducts={initialProducts}
        allModels={allModels}
        productsTotal={productsTotal}
        productsPage={productsPage}
        productsTotalPages={productsTotalPages}
        filters={filters}
        isFilterPending={isPending}
      />
    </div>
  );
}
