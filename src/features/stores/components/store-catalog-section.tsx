import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
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
      page: 1,
      limit: PRODUCTS_PAGE_SIZE
    }),
    getStoreModels(store.slug)
  ]);

  const categories = categoriesResult ?? [];
  const products = productsResult?.items ?? [];

  return (
    <StoreCatalogClient
      store={store}
      categories={categories}
      initialProducts={products}
      allModels={models}
      productsTotal={productsResult?.total ?? 0}
      productsPage={productsResult?.page ?? 1}
      productsTotalPages={productsResult?.totalPages ?? 1}
      filters={filters}
    />
  );
}
