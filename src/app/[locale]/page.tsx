import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MarketplaceSection } from '@/features/marketplace/components/marketplace-section';
import { MarketplaceShell } from '@/features/marketplace/components/marketplace-shell';
import { MarketplaceSkeleton } from '@/features/marketplace/components/marketplace-skeleton';
import { getMarketplaceHubLabel } from '@/features/marketplace/api/service';
import { JsonLd } from '@/components/seo/json-ld';
import { faqPageJsonLd, homeGraphJsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata, isSearchNoIndex } from '@/lib/seo/metadata';
import { CITY_PREFERENCE_COOKIE } from '@/constants/city-preference';
import { resolveCityPreferenceFromCookie } from '@/lib/city-preference';
import {
  commitMarketplaceSearchQuery,
  parseMarketplaceListingFilters,
  sanitizeMarketplaceText
} from '@/lib/marketplace-filters';
import type { HomePageProps } from '@/types/common';

export const revalidate = 30;

export async function generateMetadata({ params, searchParams }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearch = await searchParams;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return buildPageMetadata({
    locale,
    title: t('homeTitle'),
    description: t('homeDescription'),
    path: '/',
    canonicalPath: '/',
    noIndex: isSearchNoIndex(resolvedSearch)
  });
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearch = await searchParams;
  const committedQ = commitMarketplaceSearchQuery(resolvedSearch.q);
  const q = committedQ ?? '';
  const modelKey = sanitizeMarketplaceText(resolvedSearch.model, 160) || null;
  const filters = parseMarketplaceListingFilters(resolvedSearch);
  const cookieStore = await cookies();
  const { cityId, hasPreference } = resolveCityPreferenceFromCookie(
    cookieStore.get(CITY_PREFERENCE_COOKIE)?.value
  );
  const selectedCityName = await getMarketplaceHubLabel(cityId);
  const t = await getTranslations({ locale, namespace: 'faq' });

  const faqLd = faqPageJsonLd([
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') }
  ]);

  return (
    <>
      <JsonLd id='ld-home' data={homeGraphJsonLd(locale)} />
      {faqLd ? <JsonLd id='ld-faq' data={faqLd} /> : null}
      <MarketplaceShell
        searchQuery={q}
        modelKey={modelKey}
        cityId={cityId}
        selectedCityName={selectedCityName}
        hasCityPreference={hasPreference}
        filters={filters}
      >
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceSection
            searchQuery={q}
            modelKey={modelKey}
            cityId={cityId}
            filters={filters}
          />
        </Suspense>
      </MarketplaceShell>
    </>
  );
}
