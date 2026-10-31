import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreProductDetail } from '@/features/products/api/service';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { productPath } from '@/lib/seo/slug';
import { absoluteProductImageUrl } from '@/constants/placeholders';
import { formatEmpty } from '@/lib/formatters';

export async function buildProductMetadata(
  locale: string,
  slug: string,
  productId: string
): Promise<Metadata> {
  const [store, product] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId)
  ]);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  if (!store || !product) {
    return buildPageMetadata({
      locale,
      title: t('productFallbackTitle'),
      description: t('productFallbackDescription'),
      path: `/shop/${slug}/product/${productId}`,
      noIndex: true
    });
  }

  const productName = formatEmpty(product.name);
  const storeName = formatEmpty(store.displayName);
  const title = t('productTitle', { product: productName, store: storeName });
  const description =
    product.description?.trim() ||
    t('productDescription', { product: productName, store: storeName });
  const path = productPath(slug, product.name, product.id);
  const imageUrl = absoluteProductImageUrl(product.images?.[0]?.url);

  return buildPageMetadata({
    locale,
    title,
    description,
    path,
    canonicalPath: path,
    type: 'website',
    images: [{ url: imageUrl, alt: productName }]
  });
}
