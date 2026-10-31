import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/request';
import { getPublicStores } from '@/features/stores/api/service';
import { getStoreProducts } from '@/features/products/api/service';
import { absoluteLocaleUrl } from '@/lib/seo/site-url';
import { productPath } from '@/lib/seo/slug';
const MAX_URLS_PER_SITEMAP = 45_000;

async function collectStoreEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of locales) {
    entries.push({
      url: absoluteLocaleUrl(locale, '/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1
    });
    entries.push({
      url: absoluteLocaleUrl(locale, '/shops'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9
    });
  }

  const storesResult = await getPublicStores({ limit: 50, page: 1 });
  const stores = storesResult?.items ?? [];
  let page = 1;
  let totalPages = storesResult?.totalPages ?? 1;
  const allStores = [...stores];

  while (page < totalPages && page < 50) {
    page += 1;
    const next = await getPublicStores({ limit: 50, page });
    if (!next?.items?.length) break;
    allStores.push(...next.items);
    totalPages = next.totalPages;
  }

  for (const store of allStores) {
    if (!store.slug) continue;

    for (const locale of locales) {
      entries.push({
        url: absoluteLocaleUrl(locale, `/shop/${store.slug}`),
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8
      });
    }

    const productsResult = await getStoreProducts(store.slug, { limit: 50, page: 1 });
    const products = productsResult?.items ?? [];
    let productPage = 1;
    let productTotalPages = productsResult?.totalPages ?? 1;
    const allProducts = [...products];

    while (productPage < productTotalPages && productPage < 20) {
      productPage += 1;
      const nextProducts = await getStoreProducts(store.slug, { limit: 50, page: productPage });
      if (!nextProducts?.items?.length) break;
      allProducts.push(...nextProducts.items);
      productTotalPages = nextProducts.totalPages;
    }

    for (const product of allProducts) {
      const path = productPath(store.slug, product.name, product.id);
      for (const locale of locales) {
        entries.push({
          url: absoluteLocaleUrl(locale, path),
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6
        });
      }
    }
  }

  return entries.slice(0, MAX_URLS_PER_SITEMAP);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    return await collectStoreEntries();
  } catch {
    const now = new Date();
    return locales.map((locale) => ({
      url: absoluteLocaleUrl(locale, '/'),
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1
    }));
  }
}
