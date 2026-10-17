import { getPublicStores } from '@/features/stores/api/service';
import { getStoreProducts } from '@/features/products/api/service';
import { toProductKey } from '@/lib/seo/slug';
import { locales } from '@/i18n/request';
import type { ProductStaticParam } from '@/types/seo';

export async function buildProductStaticParams(): Promise<ProductStaticParam[]> {
  const storesResult = await getPublicStores({ limit: 30, page: 1 });
  const stores = storesResult?.items ?? [];
  const params: ProductStaticParam[] = [];

  for (const store of stores) {
    const productsResult = await getStoreProducts(store.slug, { limit: 40, page: 1 });
    for (const product of productsResult?.items ?? []) {
      const key = toProductKey(product.name, product.id);
      for (const locale of locales) {
        params.push({ locale, slug: store.slug, productId: key });
      }
    }
  }

  return params;
}
