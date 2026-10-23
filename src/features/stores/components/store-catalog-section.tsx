import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
import { getStoreModels, getStoreProducts } from '@/features/products/api/service';
import { StoreCatalogFeed } from '@/features/stores/components/store-catalog-feed';
import type { StoreCatalogSectionProps } from '@/types/store';

export async function StoreCatalogSection({ store, filters }: StoreCatalogSectionProps) {
  const [productsResult, models] = await Promise.all([
    getStoreProducts(store.slug, {
      q: filters.q || undefined,
      category: filters.category || undefined,
      page: 1,
      limit: PRODUCTS_PAGE_SIZE
    }),
    getStoreModels(store.slug)
  ]);

  const products = productsResult?.items ?? [];

  return (
    <StoreCatalogFeed
      store={store}
      initialProducts={products}
      allModels={models}
      productsTotal={productsResult?.total ?? 0}
      productsPage={productsResult?.page ?? 1}
      productsTotalPages={productsResult?.totalPages ?? 1}
      filters={filters}
    />
  );
}
