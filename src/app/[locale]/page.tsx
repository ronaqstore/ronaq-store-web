import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StoreDiscoverySection } from '@/features/stores/components/store-discovery-section';
import { StoreDiscoveryShell } from '@/features/stores/components/store-discovery-shell';
import { StoreDiscoverySkeleton } from '@/features/stores/components/store-discovery-skeleton';
import { JsonLd } from '@/components/seo/json-ld';
import { faqPageJsonLd, homeGraphJsonLd } from '@/lib/seo/json-ld';
import { buildPageMetadata, isSearchNoIndex } from '@/lib/seo/metadata';
import type { HomePageProps } from '@/types/common';

export const revalidate = 120;

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

  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? '';
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
      <StoreDiscoveryShell searchQuery={q}>
        <Suspense key={q || 'all'} fallback={<StoreDiscoverySkeleton />}>
          <StoreDiscoverySection searchQuery={q} />
        </Suspense>
      </StoreDiscoveryShell>
    </>
  );
}
