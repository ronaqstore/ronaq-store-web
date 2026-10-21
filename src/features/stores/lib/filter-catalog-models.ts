import type { StoreCatalogFilters } from '@/types/store';
import type { StoreModelListItem, StoreProductListItem } from '@/types/product';

export function filterModelsForCatalog(
  models: StoreModelListItem[],
  products: StoreProductListItem[],
  filters: StoreCatalogFilters
): StoreModelListItem[] {
  let list = models;

  if (filters.category) {
    const keys = new Set(
      products
        .filter((p) => p.trackingType === 'SERIALIZED' && p.modelKey)
        .map((p) => p.modelKey as string)
    );
    list = keys.size > 0 ? models.filter((m) => keys.has(m.key)) : [];
  } else {
    const keys = new Set(
      products
        .filter((p) => p.trackingType === 'SERIALIZED' && p.modelKey)
        .map((p) => p.modelKey as string)
    );
    if (keys.size > 0) {
      list = models.filter((m) => keys.has(m.key));
    } else {
      list = [];
    }
  }

  if (filters.inStock) {
    list = list.filter((m) => m.availability !== 'OUT_OF_STOCK');
  }

  const q = filters.q.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (m) => m.brand.toLowerCase().includes(q) || m.model.toLowerCase().includes(q)
    );
  }

  return list;
}
