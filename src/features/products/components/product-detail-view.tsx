import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/json-ld';
import { productPath } from '@/lib/seo/slug';
import { formatEmpty, formatProductCardTitle } from '@/lib/formatters';
import { ProductGallery } from './product-gallery';
import { ProductInfo } from './product-info';
import { ProductSpecs } from './product-specs';
import { RelatedProducts } from './related-products';
import { StickyMobileCTA } from './sticky-mobile-cta';
import {
  productConditionMessageKey,
  resolveProductCondition
} from '@/lib/product-condition';
import type { ProductDetailViewProps } from '@/types/product';

export async function ProductDetailView({
  locale,
  slug,
  store,
  product,
  relatedProducts = [],
  relatedBrowseHref = '/'
}: ProductDetailViewProps) {
  const t = await getTranslations();
  const storeName = store.displayName || store.name;
  const path = productPath(slug, product.name, product.id);
  const displayTitle = formatProductCardTitle(product.name, product.brandName);

  const crumbs = [
    { name: t('nav.home'), path: '/' },
    { name: storeName, path: `/shop/${slug}` },
    { name: displayTitle, path }
  ];

  const condition = resolveProductCondition(product);
  const conditionLabel = condition
    ? t(`catalog.${productConditionMessageKey(condition)}`)
    : null;

  return (
    <article className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-12 space-y-8 md:space-y-10 lg:space-y-14'>
      <JsonLd
        id='ld-product'
        data={productJsonLd({
          locale,
          store,
          product,
          productPath: path
        })}
      />
      <JsonLd id='ld-product-breadcrumbs' data={breadcrumbJsonLd(locale, crumbs)} />

      <div className='flex items-center justify-between gap-4 mb-4'>
        <Link
          href={`/shop/${slug}`}
          className='inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground'
        >
          <Icons.arrowLeft className='h-4 w-4 rtl:rotate-180' />
          <span>{t('catalog.backToShop', { store: formatEmpty(storeName) })}</span>
        </Link>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 2xl:gap-12 items-start'>
        <div className='lg:col-span-7 lg:sticky lg:top-24 min-w-0'>
          <ProductGallery
            images={product.images ?? []}
            productName={product.name}
            badgeLabel={conditionLabel}
          />
        </div>

        <div className='lg:col-span-5 min-w-0'>
          <div className='rounded-3xl border border-border/80 bg-card p-4 md:p-5 lg:p-6 shadow-xs'>
            <ProductInfo
              product={product}
              store={store}
              slug={slug}
              crumbs={crumbs}
            />
          </div>
        </div>
      </div>

      <div className='pt-2'>
        <ProductSpecs product={product} store={store} slug={slug} />
      </div>

      {relatedProducts.length > 0 ? (
        <RelatedProducts
          products={relatedProducts}
          browseHref={relatedBrowseHref}
        />
      ) : null}

      <StickyMobileCTA product={product} store={store} />
    </article>
  );
}
