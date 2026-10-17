import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { ProductCard } from '@/components/products/product-card';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/json-ld';
import { productPath } from '@/lib/seo/slug';
import {
  formatPrice,
  buildWhatsAppLink,
  formatEmpty,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import type { ProductDetailViewProps } from '@/types/product';

export async function ProductDetailView({
  locale,
  slug,
  store,
  product,
  relatedProducts = []
}: ProductDetailViewProps) {
  const t = await getTranslations();
  const storeName = store.displayName;
  const storePhone = resolveStoreWhatsAppNumber(store);
  const path = productPath(slug, product.name, product.id);
  const crumbs = [
    { name: t('nav.home'), path: '/' },
    { name: storeName, path: `/shop/${slug}` },
    { name: product.name, path }
  ];

  const formattedPrice = product.contactForPrice
    ? t('catalog.contactForPrice')
    : formatPrice(product.retailPrice);
  const whatsappHref = buildWhatsAppLink(
    storePhone,
    t('whatsapp.buyProduct', {
      storeName,
      productName: product.name,
      price: formattedPrice
    })
  );

  return (
    <article className='mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-8'>
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
      <Breadcrumbs items={crumbs} />

      <Link
        href={`/shop/${slug}`}
        className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
      >
        <Icons.arrowLeft className='h-4 w-4' />
        {t('catalog.backToShop', { store: formatEmpty(storeName) })}
      </Link>

      <div className='rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6'>
        <ProductImageGallery images={product.images ?? []} productName={product.name} />

        <div className='space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            {product.categoryName ? (
              <Link
                href={`/shop/${slug}?category=${encodeURIComponent(product.categoryId || product.categoryName)}`}
              >
                <Badge variant='outline'>{formatEmpty(product.categoryName)}</Badge>
              </Link>
            ) : (
              <Badge variant='outline'>{formatEmpty(product.categoryName)}</Badge>
            )}
            <Badge variant='secondary'>{formatEmpty(product.brandName)}</Badge>
            {product.ptaStatus === 'APPROVED' ? (
              <Badge variant='success'>{t('catalog.ptaApproved')}</Badge>
            ) : null}
            <StockBadge availability={product.availability} stockCount={product.stockCount} />
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-foreground'>
            {formatEmpty(product.name)}
          </h1>

          <div className='text-3xl font-black text-primary'>{formattedPrice}</div>

          <div className='space-y-1.5 pt-2 border-t border-border/50'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('catalog.description')}
            </h2>
            <p className='text-sm text-foreground/90 whitespace-pre-line leading-relaxed'>
              {formatEmpty(product.description)}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs'>
            <div className='rounded-lg bg-muted/40 p-2.5'>
              <span className='text-muted-foreground'>{t('catalog.condition')}: </span>
              <span className='font-semibold text-foreground'>
                {formatEmpty(product.condition)}
              </span>
            </div>
            <div className='rounded-lg bg-muted/40 p-2.5'>
              <span className='text-muted-foreground'>{t('catalog.warranty')}: </span>
              <span className='font-semibold text-foreground'>
                {formatEmpty(product.warrantyType)}
              </span>
            </div>
          </div>
        </div>

        {product.contactForPrice && storePhone ? (
          <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='block'>
            <Button
              type='button'
              size='lg'
              className='w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
            >
              <Icons.whatsapp className='h-5 w-5' />
              {t('catalog.inquireWhatsApp')}
            </Button>
          </a>
        ) : null}
      </div>

      {relatedProducts.length > 0 ? (
        <section aria-labelledby='related-products-heading' className='space-y-4'>
          <div className='flex items-end justify-between gap-3'>
            <h2 id='related-products-heading' className='text-xl font-bold tracking-tight'>
              {t('catalog.relatedProducts')}
            </h2>
            <Link
              href={`/shop/${slug}`}
              className='text-sm font-medium text-primary hover:underline'
            >
              {t('catalog.viewShopCatalog')}
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                storeSlug={slug}
                storeName={storeName}
                storePhone={storePhone}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
