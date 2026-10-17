import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getPublicStoreProfile, getPublicStores } from '@/features/stores/api/service';
import { ShopPageView } from '@/features/stores/components/shop-page-view';
import { buildShopMetadata } from '@/features/stores/lib/shop-metadata';
import { parseCatalogFilters } from '@/features/stores/lib/parse-catalog-filters';
import { locales } from '@/i18n/request';
import type { StorePageProps } from '@/types/common';

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const result = await getPublicStores({ limit: 50, page: 1 });
  const stores = result?.items ?? [];
  return locales.flatMap((locale) =>
    stores.map((store) => ({
      locale,
      slug: store.slug
    }))
  );
}

export async function generateMetadata({ params, searchParams }: StorePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedSearch = await searchParams;
  return buildShopMetadata(locale, slug, resolvedSearch);
}

export default async function ShopPage({ params, searchParams }: StorePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!slug) notFound();

  const filters = parseCatalogFilters(await searchParams);
  const store = await getPublicStoreProfile(slug);
  if (!store) notFound();

  return <ShopPageView locale={locale} store={store} filters={filters} />;
}
