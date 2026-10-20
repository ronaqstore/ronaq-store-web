import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { StoreHeader } from '@/features/stores/components/store-header';
import { StoreCatalogSection } from '@/features/stores/components/store-catalog-section';
import { StoreCatalogSkeleton } from '@/features/stores/components/store-catalog-skeleton';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  localBusinessJsonLd
} from '@/lib/seo/json-ld';
import { productPath } from '@/lib/seo/slug';
import { getStoreProducts } from '@/features/products/api/service';
import type { ShopPageViewProps } from '@/types/store';

export async function ShopPageView({ locale, store, filters }: ShopPageViewProps) {
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tCatalog = await getTranslations({ locale, namespace: 'catalog' });
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });
  const productsPreview = await getStoreProducts(store.slug, { limit: 24 });
  const productItems = (productsPreview?.items ?? []).map((product) => ({
    name: product.name,
    path: productPath(store.slug, product.name, product.id)
  }));

  const crumbs = [
    { name: tNav('home'), path: '/' },
    { name: store.displayName, path: `/shop/${store.slug}` }
  ];
  const shopPath = `/shop/${store.slug}`;
  const collectionDescription =
    store.description?.trim() ||
    tMeta('shopDescription', { store: store.displayName, city: store.city });

  return (
    <article>
      <JsonLd id='ld-store-business' data={localBusinessJsonLd(locale, store, shopPath)} />
      <JsonLd id='ld-store-breadcrumbs' data={breadcrumbJsonLd(locale, crumbs)} />
      <JsonLd
        id='ld-store-collection'
        data={collectionPageJsonLd({
          locale,
          name: store.displayName,
          description: collectionDescription,
          path: shopPath,
          items: productItems
        })}
      />

      <div className='mx-auto max-w-[1600px] px-4 pt-4 sm:px-6 lg:px-8'>
        <Breadcrumbs items={crumbs} />
      </div>

      <StoreHeader store={store} />
      <section aria-labelledby='shop-catalog-heading'>
        <h2 id='shop-catalog-heading' className='sr-only'>
          {tCatalog('shopCatalogHeading', { store: store.displayName })}
        </h2>
        <Suspense fallback={<StoreCatalogSkeleton />}>
          <StoreCatalogSection store={store} filters={filters} />
        </Suspense>
      </section>
    </article>
  );
}
