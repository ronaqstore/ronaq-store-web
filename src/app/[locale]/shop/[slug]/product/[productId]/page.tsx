import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { CITY_PREFERENCE_COOKIE } from '@/constants/city-preference';
import { getMarketplaceRelatedProducts } from '@/features/marketplace/api/service';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreProductDetail } from '@/features/products/api/service';
import { ProductDetailView } from '@/features/products/components/product-detail-view';
import { buildProductMetadata } from '@/features/products/lib/product-metadata';
import { buildProductStaticParams } from '@/features/products/lib/product-static-params';
import {
  marketplaceCityQueryParam,
  resolveCityPreferenceFromCookie
} from '@/lib/city-preference';
import { extractProductId, productPath, toProductKey } from '@/lib/seo/slug';
import type { ProductPageProps } from '@/types/common';

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  return buildProductStaticParams();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug, productId } = await params;
  return buildProductMetadata(locale, slug, productId);
}

function buildRelatedBrowseHref(brandName: string | null | undefined, cityId: string): string {
  const params = new URLSearchParams();
  const brand = brandName?.trim();
  if (brand) params.set('q', brand);
  const city = marketplaceCityQueryParam(cityId);
  if (city) params.set('city', city);
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug, productId } = await params;
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const cityPreference = resolveCityPreferenceFromCookie(
    cookieStore.get(CITY_PREFERENCE_COOKIE)?.value
  );

  const [store, product] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId)
  ]);
  if (!store || !product) notFound();

  const canonicalKey = toProductKey(product.name, product.id);
  if (productId !== canonicalKey && extractProductId(productId) === product.id) {
    permanentRedirect(`/${locale}${productPath(slug, product.name, product.id)}`);
  }

  const related = await getMarketplaceRelatedProducts(
    product.id,
    cityPreference.cityId,
    8
  );
  const relatedProducts = related?.items ?? [];

  return (
    <ProductDetailView
      locale={locale}
      slug={slug}
      store={store}
      product={product}
      relatedProducts={relatedProducts}
      relatedBrowseHref={buildRelatedBrowseHref(product.brandName, cityPreference.cityId)}
    />
  );
}
