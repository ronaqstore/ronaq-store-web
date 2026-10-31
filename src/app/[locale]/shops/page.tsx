import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getMarketplaceHubLabel } from '@/features/marketplace/api/service';
import { StoreDiscoverySection } from '@/features/stores/components/store-discovery-section';
import { StoreDiscoveryShell } from '@/features/stores/components/store-discovery-shell';
import { StoreDiscoverySkeleton } from '@/features/stores/components/store-discovery-skeleton';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata, isSearchNoIndex } from '@/lib/seo/metadata';
import { CITY_PREFERENCE_COOKIE } from '@/constants/city-preference';
import { resolveCityPreference } from '@/lib/city-preference';
import { sanitizeMarketplaceText } from '@/lib/marketplace-filters';
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

  const resolvedSearch = await searchParams;
  const q = sanitizeMarketplaceText(resolvedSearch.q);
  const cookieStore = await cookies();
  const { cityId, hasPreference } = resolveCityPreference(
    resolvedSearch.city,
    cookieStore.get(CITY_PREFERENCE_COOKIE)?.value
  );
  const selectedCityName = await getMarketplaceHubLabel(cityId);
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
      <StoreDiscoveryShell
        searchQuery={q}
        cityId={cityId}
        selectedCityName={selectedCityName}
        hasCityPreference={hasPreference}
      >
        <Suspense key={cityId} fallback={<StoreDiscoverySkeleton />}>
          <StoreDiscoverySection searchQuery={q} cityId={cityId} />
        </Suspense>
      </StoreDiscoveryShell>
    </>
  );
}
