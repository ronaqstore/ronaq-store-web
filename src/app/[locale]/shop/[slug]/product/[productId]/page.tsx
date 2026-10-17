import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreProductDetail, getStoreProducts } from '@/features/products/api/service';
import { ProductDetailView } from '@/features/products/components/product-detail-view';
import { buildProductMetadata } from '@/features/products/lib/product-metadata';
import { buildProductStaticParams } from '@/features/products/lib/product-static-params';
import { extractProductId, productPath, toProductKey } from '@/lib/seo/slug';
import type { ProductPageProps } from '@/types/common';

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  return buildProductStaticParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug, productId } = await params;
  return buildProductMetadata(locale, slug, productId);
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug, productId } = await params;
  setRequestLocale(locale);

  const [store, product] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId)
  ]);
  if (!store || !product) notFound();

  const canonicalKey = toProductKey(product.name, product.id);
  if (productId !== canonicalKey && extractProductId(productId) === product.id) {
    permanentRedirect(`/${locale}${productPath(slug, product.name, product.id)}`);
  }

  const relatedProducts = ((await getStoreProducts(slug, { limit: 12 }))?.items ?? [])
    .filter((item) => item.id !== product.id)
    .filter((item) => (product.categoryName ? item.categoryName === product.categoryName : true))
    .slice(0, 4);

  return (
    <ProductDetailView
      locale={locale}
      slug={slug}
      store={store}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
