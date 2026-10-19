import {
  getStoreCategories,
  getStoreModels,
  getStoreProducts
} from '@/features/products/api/service';
import { StoreCatalogClient } from '@/features/stores/components/store-catalog-client';
import type { StoreCatalogSectionProps } from '@/types/store';

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
  const q = filters.q.trim().toLowerCase();
  const filteredModels = q
    ? models.filter(
        (m) =>
          m.brand.toLowerCase().includes(q) ||
          m.model.toLowerCase().includes(q)
      )
    : models;

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
