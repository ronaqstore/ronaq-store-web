import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreCategories, getStoreProducts } from '@/features/products/api/service';
import { StoreHeader } from '@/features/stores/components/store-header';
import { StoreCatalogClient } from '@/features/stores/components/store-catalog-client';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  getSeedStoreProfile
} from '@/constants/seed-data';
import type { StorePageProps } from '@/types/common';

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = (await getPublicStoreProfile(slug)) ?? getSeedStoreProfile(slug);
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

export default async function ShopPage({ params }: StorePageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const [profileResult, categoriesResult, productsResult] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreCategories(slug),
    getStoreProducts(slug, { limit: 100 })
  ]);

  const store = profileResult ?? getSeedStoreProfile(slug);
  const categories =
    categoriesResult && categoriesResult.length > 0 ? categoriesResult : SEED_CATEGORIES;
  const products =
    productsResult && productsResult.items.length > 0 ? productsResult.items : SEED_PRODUCTS;

  return (
    <div>
      <StoreHeader store={store} />
      <StoreCatalogClient
        store={store}
        initialCategories={categories}
        initialProducts={products}
      />
    </div>
  );
}
