import { getStoreCategories, getStoreProducts } from '@/features/products/api/service';
import { StoreCatalogClient } from '@/features/stores/components/store-catalog-client';
import type { StoreCatalogSectionProps } from '@/types/store';

export async function StoreCatalogSection({ store, filters }: StoreCatalogSectionProps) {
  const [categoriesResult, productsResult] = await Promise.all([
    getStoreCategories(store.slug),
    getStoreProducts(store.slug, {
      q: filters.q || undefined,
      category: filters.category || undefined,
      inStock: filters.inStock || undefined,
      limit: 50
    })
  ]);

  const categories = categoriesResult ?? [];
  const products = productsResult?.items ?? [];

  return (
    <StoreCatalogClient
      store={store}
      categories={categories}
      products={products}
      filters={filters}
    />
  );
}
