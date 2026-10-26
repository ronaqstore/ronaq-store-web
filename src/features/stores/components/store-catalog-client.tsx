'use client';

import { useCallback, useTransition } from 'react';
import { ProductFilters } from '@/components/products/product-filters';
import { usePathname, useRouter } from '@/i18n/navigation';
import { productPath } from '@/lib/seo/slug';
import type { StoreCatalogShellProps, StoreCatalogFilters } from '@/types/store';
import type { StoreProductListItem } from '@/types/product';

function buildQuery(filters: StoreCatalogFilters): Record<string, string> {
  const query: Record<string, string> = {};
  if (filters.q) query.q = filters.q;
  if (filters.category) query.category = filters.category;
  return query;
}

export function StoreCatalogShell({
  storeSlug,
  categories,
  filters,
  children
}: StoreCatalogShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const replaceFilters = useCallback(
    (next: StoreCatalogFilters) => {
      const query = buildQuery(next);
      startTransition(() => {
        if (Object.keys(query).length > 0) {
          router.replace({ pathname, query }, { scroll: false });
        } else {
          router.replace(pathname, { scroll: false });
        }
      });
    },
    [pathname, router]
  );

  const handleCommitSearch = useCallback(
    (q: string) => {
      replaceFilters({
        q,
        category: filters.category,
        inStock: filters.inStock
      });
    },
    [filters.category, filters.inStock, replaceFilters]
  );

  const handleClearSearch = useCallback(() => {
    replaceFilters({
      q: '',
      category: filters.category,
      inStock: filters.inStock
    });
  }, [filters.category, filters.inStock, replaceFilters]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      replaceFilters({
        q: filters.q,
        category,
        inStock: filters.inStock
      });
    },
    [filters.inStock, filters.q, replaceFilters]
  );

  const handleSelectProduct = useCallback(
    (product: StoreProductListItem) => {
      startTransition(() => {
        router.push(productPath(storeSlug, product.name, product.id));
      });
    },
    [router, storeSlug]
  );

  return (
    <div className='mx-auto max-w-[1600px] space-y-5 px-4 pb-10 pt-4 sm:space-y-6 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8'>
      <ProductFilters
        storeSlug={storeSlug}
        categories={categories}
        selectedCategoryId={filters.category}
        committedQuery={filters.q}
        onCategorySelect={handleCategorySelect}
        onCommitSearch={handleCommitSearch}
        onSelectProduct={handleSelectProduct}
        onClearSearch={handleClearSearch}
      />

      {children}
    </div>
  );
}
