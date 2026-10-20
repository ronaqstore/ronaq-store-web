import {
  getStoreCategories,
  getStoreModels,
  getStoreProducts
} from '@/features/products/api/service';
import { StoreCatalogClient } from '@/features/stores/components/store-catalog-client';
import type { StoreCatalogFilters, StoreCatalogSectionProps } from '@/types/store';
import type { StoreModelListItem, StoreProductListItem } from '@/types/product';

function filterModelsForCatalog(
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

export async function StoreCatalogSection({ store, filters }: StoreCatalogSectionProps) {
  const [categoriesResult, productsResult, models] = await Promise.all([
    getStoreCategories(store.slug),
    getStoreProducts(store.slug, {
      q: filters.q || undefined,
      category: filters.category || undefined,
      inStock: filters.inStock || undefined,
      limit: 50
    }),
    getStoreModels(store.slug)
  ]);

  const categories = categoriesResult ?? [];
  const products = productsResult?.items ?? [];
  const filteredModels = filterModelsForCatalog(models, products, filters);

  return (
    <StoreCatalogClient
      store={store}
      categories={categories}
      products={products}
      models={filteredModels}
      filters={filters}
    />
  );
}
