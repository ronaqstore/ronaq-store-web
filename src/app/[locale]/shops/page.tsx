import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StoreDiscoverySection } from '@/features/stores/components/store-discovery-section';
import { StoreDiscoveryShell } from '@/features/stores/components/store-discovery-shell';
import { StoreDiscoverySkeleton } from '@/features/stores/components/store-discovery-skeleton';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata, isSearchNoIndex } from '@/lib/seo/metadata';
import type { HomePageProps } from '@/types/common';

export const revalidate = 30;

export async function generateMetadata({ params, searchParams }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearch = await searchParams;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return buildPageMetadata({
    locale,
    title: t('shopsTitle'),
    description: t('shopsDescription'),
    path: '/shops',
    canonicalPath: '/shops',
    noIndex: isSearchNoIndex(resolvedSearch)
  });
}

export default async function ShopsPage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? '';
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return (
    <>
      <JsonLd
        id='ld-shops-breadcrumb'
        data={breadcrumbJsonLd(locale, [
          { name: t('homeTitle'), path: '/' },
          { name: t('shopsTitle'), path: '/shops' }
        ])}
      />
      <StoreDiscoveryShell searchQuery={q}>
        <Suspense key={q || 'all'} fallback={<StoreDiscoverySkeleton />}>
          <StoreDiscoverySection searchQuery={q} />
        </Suspense>
      </StoreDiscoveryShell>
    </>
  );
}
