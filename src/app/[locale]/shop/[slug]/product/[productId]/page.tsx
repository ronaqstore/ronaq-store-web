import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreProductDetail } from '@/features/products/api/service';
import { ProductDetailView } from '@/features/products/components/product-detail-view';
import { absoluteProductImageUrl } from '@/constants/placeholders';
import { formatEmpty } from '@/lib/formatters';
import type { ProductPageProps } from '@/types/common';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, productId } = await params;
  const [store, product] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId)
  ]);

  const productName = formatEmpty(product?.name, 'Product');
  const storeName = formatEmpty(store?.displayName, 'Ronaq Store');
  const title = product ? `${productName} — ${storeName}` : 'Product Details — Ronaq Store';
  const description =
    product?.description?.trim() ||
    `View ${productName} at ${storeName}. Check price, PTA status, and order on WhatsApp.`;
  const imageUrl = absoluteProductImageUrl(product?.images?.[0]?.url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: imageUrl, alt: productName }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug, productId } = await params;
  const [store, product] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId)
  ]);

  if (!store || !product) notFound();

  return (
    <ProductDetailView
      slug={slug}
      storeName={store.displayName}
      storePhone={store.phoneNumber}
      product={product}
    />
  );
}
