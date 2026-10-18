import type { CatalogSearchParams } from '@/types/common';
import type { StoreCatalogFilters } from '@/types/store';

export function parseCatalogFilters(searchParams: CatalogSearchParams): StoreCatalogFilters {
  return {
    q: searchParams.q?.trim() ?? '',
    category: searchParams.category?.trim() ?? '',
    inStock: searchParams.inStock === '1' || searchParams.inStock === 'true'
  };
}
