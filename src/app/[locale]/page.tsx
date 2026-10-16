import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { StoreDiscoverySection } from '@/features/stores/components/store-discovery-section';
import { StoreDiscoveryShell } from '@/features/stores/components/store-discovery-shell';
import { StoreDiscoverySkeleton } from '@/features/stores/components/store-discovery-skeleton';
import type { HomePageProps } from '@/types/common';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description')
    }
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? '';

  return (
    <StoreDiscoveryShell searchQuery={q}>
      <Suspense key={q || 'all'} fallback={<StoreDiscoverySkeleton />}>
        <StoreDiscoverySection searchQuery={q} />
      </Suspense>
    </StoreDiscoveryShell>
  );
}
