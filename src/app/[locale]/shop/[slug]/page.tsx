import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { StoreHeader } from '@/features/stores/components/store-header';
import { StoreCatalogSection } from '@/features/stores/components/store-catalog-section';
import { StoreCatalogSkeleton } from '@/features/stores/components/store-catalog-skeleton';
import type { CatalogSearchParams, StorePageProps } from '@/types/common';
import type { StoreCatalogFilters } from '@/types/store';

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getPublicStoreProfile(slug);
  if (!store) {
    return { title: 'Shop — Ronaq Store' };
  }

  const title = `${store.displayName} — Ronaq Store`;
  const description = `Shop mobile phones, chargers and accessories at ${store.displayName} in ${store.city}. View live prices and chat on WhatsApp.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description
    }
  };
}

function parseCatalogFilters(searchParams: CatalogSearchParams): StoreCatalogFilters {
  return {
    q: searchParams.q?.trim() ?? '',
    category: searchParams.category?.trim() ?? '',
    inStock: searchParams.inStock === '1' || searchParams.inStock === 'true'
  };
}

export default async function ShopPage({ params, searchParams }: StorePageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const resolvedSearchParams = await searchParams;
  const filters = parseCatalogFilters(resolvedSearchParams);

  const store = await getPublicStoreProfile(slug);
  if (!store) notFound();

  return (
    <div>
      <StoreHeader store={store} />
      <Suspense
        key={`${filters.q}|${filters.category}|${filters.inStock}`}
        fallback={<StoreCatalogSkeleton />}
      >
        <StoreCatalogSection store={store} filters={filters} />
      </Suspense>
    </div>
  );
}
