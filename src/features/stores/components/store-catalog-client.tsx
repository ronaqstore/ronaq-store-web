'use client';

import { useEffect, useTransition } from 'react';
import { ProductFilters } from '@/components/products/product-filters';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedUrlSearch } from '@/hooks/use-debounced-url-search';
import type { StoreCatalogShellProps, StoreCatalogFilters } from '@/types/store';

function buildQuery(filters: StoreCatalogFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.q) query.q = filters.q;
  if (filters.category) query.category = filters.category;
  return query;
}

export function StoreCatalogShell({
  categories,
  filters,
  children
}: StoreCatalogShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    shouldSyncUrl,
    markUrlSync
  } = useDebouncedUrlSearch(filters.q, 400);

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
    if (!shouldSyncUrl) return;
    markUrlSync(debouncedQuery);
    replaceFilters({
      q: debouncedQuery,
      category: filters.category,
      inStock: filters.inStock
    });
  }, [debouncedQuery, shouldSyncUrl, filters.category, filters.inStock]);

  const handleCategorySelect = (category: string) => {
    markUrlSync(searchQuery.trim());
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

      {children}
    </div>
  );
}
