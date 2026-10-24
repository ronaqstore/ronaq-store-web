import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { MarketplaceProductCard } from '@/components/products/marketplace-product-card';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo/json-ld';
import { productPath } from '@/lib/seo/slug';
import {
  formatPrice,
  buildWhatsAppLink,
  formatEmpty,
  formatPhone,
  formatProductCardTitle,
  formatStorageLabel,
  formatColorLabel,
  formatTitleCase,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import {
  productConditionMessageKey,
  resolveProductCondition
} from '@/lib/product-condition';
import { cn } from '@/lib/utils';
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
  const storeName = store.displayName;
  const whatsappNumber = resolveStoreWhatsAppNumber(store);
  const contactNumber = store.phoneNumber?.trim() || '';
  const path = productPath(slug, product.name, product.id);
  const displayTitle = formatProductCardTitle(product.name, product.brandName);
  const storageLabel = formatStorageLabel(product.storage);
  const colorLabel = formatColorLabel(product.color);
  const crumbs = [
    { name: t('nav.home'), path: '/' },
    { name: storeName, path: `/shop/${slug}` },
    { name: displayTitle, path }
  ];

  const formattedPrice = formatPrice(product.retailPrice);
  const condition = resolveProductCondition(product);
  const conditionLabel = condition
    ? t(`catalog.${productConditionMessageKey(condition)}`)
    : null;
  const specDetails = [storageLabel, colorLabel].filter(Boolean).join(', ');
  const fullProductName = specDetails
    ? `${displayTitle} (${specDetails})`
    : displayTitle;
  const whatsappPrice = formattedPrice ?? '';

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        t('whatsapp.buyProduct', {
          storeName,
          productName: fullProductName,
          price: whatsappPrice
        })
      )
    : null;
  const contactHref = contactNumber ? `tel:${contactNumber}` : null;
  const hasContactActions = Boolean(whatsappHref || contactHref);

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

        <div className='space-y-4'>
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
              <Badge variant='success' className='gap-1'>
                <Icons.shieldCheck className='h-3 w-3' />
                {t('catalog.ptaApproved')}
              </Badge>
            ) : null}
            {product.ptaStatus === 'NON_PTA' ? (
              <Badge variant='warning'>{t('catalog.ptaNon')}</Badge>
            ) : null}
            {product.ptaStatus === 'JV' ? (
              <Badge variant='secondary'>{t('catalog.ptaJv')}</Badge>
            ) : null}
            {product.ptaStatus === 'BYPASS' ? (
              <Badge variant='secondary'>{t('catalog.ptaBypass')}</Badge>
            ) : null}
            {product.ptaStatus === 'MDM_BYPASS' ? (
              <Badge variant='secondary'>{t('catalog.ptaMdmBypass')}</Badge>
            ) : null}
            {product.authenticity === 'ORIGINAL' ? (
              <Badge variant='success'>{t('catalog.authenticityOriginal')}</Badge>
            ) : null}
            {product.authenticity === 'COPY' ? (
              <Badge variant='secondary'>{t('catalog.authenticityCopy')}</Badge>
            ) : null}
            {conditionLabel ? (
              <Badge variant='outline'>{conditionLabel}</Badge>
            ) : null}
            <StockBadge availability={product.availability} stockCount={product.stockCount} />
          </div>

          <div className='space-y-1'>
            {product.brandName ? (
              <p className='text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
                {formatTitleCase(product.brandName)}
              </p>
            ) : null}
            <h1 className='text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl'>
              {displayTitle}
            </h1>
          </div>

          {formattedPrice ? (
            <div className='text-3xl font-black tracking-tight text-primary tabular-nums'>
              {formattedPrice}
            </div>
          ) : null}

          {product.description ? (
            <div className='space-y-1.5 pt-3 border-t border-border/50'>
              <h2 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('catalog.description')}
              </h2>
              <p className='text-sm text-foreground/90 whitespace-pre-line leading-relaxed'>
                {product.description}
              </p>
            </div>
          ) : null}

          <div className='space-y-3 pt-3 border-t border-border/50'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('catalog.deviceSpecs')}
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs'>
              {product.model ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.model')}</span>
                  <span className='font-semibold text-foreground text-sm'>
                    {formatTitleCase(product.model)}
                  </span>
                </div>
              ) : null}
              {colorLabel ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.color')}</span>
                  <span className='font-semibold text-foreground text-sm'>{colorLabel}</span>
                </div>
              ) : null}
              {storageLabel ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.storage')}</span>
                  <span className='font-semibold text-foreground text-sm'>{storageLabel}</span>
                </div>
              ) : null}
              {product.ram ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.ram')}</span>
                  <span className='font-semibold text-foreground text-sm'>
                    {formatStorageLabel(product.ram)}
                  </span>
                </div>
              ) : null}
              {product.ptaStatus ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.ptaStatusLabel')}</span>
                  <span className='font-semibold text-foreground text-sm'>
                    {product.ptaStatus === 'APPROVED'
                      ? t('catalog.ptaApproved')
                      : product.ptaStatus === 'NON_PTA'
                        ? t('catalog.ptaNon')
                        : product.ptaStatus === 'JV'
                          ? t('catalog.ptaJv')
                          : product.ptaStatus === 'BYPASS'
                            ? t('catalog.ptaBypass')
                            : product.ptaStatus === 'MDM_BYPASS'
                              ? t('catalog.ptaMdmBypass')
                              : product.ptaStatus}
                  </span>
                </div>
              ) : null}
              {conditionLabel ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>
                    {t('catalog.condition')}
                  </span>
                  <span className='font-semibold text-foreground text-sm'>
                    {conditionLabel}
                  </span>
                </div>
              ) : null}
              {product.authenticity ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.authenticityLabel')}</span>
                  <span className='font-semibold text-foreground text-sm'>
                    {product.authenticity === 'ORIGINAL'
                      ? t('catalog.authenticityOriginal')
                      : t('catalog.authenticityCopy')}
                  </span>
                </div>
              ) : null}
              {product.warrantyType ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.warranty')}</span>
                  <span className='font-semibold text-foreground text-sm'>{product.warrantyType}</span>
                </div>
              ) : null}
              {product.sku ? (
                <div className='rounded-xl bg-muted/40 p-3 space-y-0.5'>
                  <span className='block text-muted-foreground text-[11px]'>{t('catalog.sku')}</span>
                  <span className='font-semibold text-foreground text-sm font-mono'>{product.sku}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {hasContactActions ? (
          <div
            className={cn(
              'grid gap-2',
              whatsappHref && contactHref ? 'sm:grid-cols-2' : 'grid-cols-1'
            )}
          >
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'w-full gap-2 bg-emerald-600 font-bold text-white hover:bg-emerald-700'
                )}
              >
                <Icons.whatsapp className='h-5 w-5' />
                {t('catalog.orderWhatsApp')}
              </a>
            ) : null}
            {contactHref ? (
              <a
                href={contactHref}
                className={cn(
                  buttonVariants({ size: 'lg', variant: whatsappHref ? 'outline' : 'default' }),
                  'w-full gap-2 font-bold'
                )}
              >
                <Icons.phone className='h-5 w-5' />
                <span dir='ltr'>{formatPhone(contactNumber)}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {relatedProducts.length > 0 ? (
        <section aria-labelledby='related-products-heading' className='space-y-4'>
          <div className='flex items-end justify-between gap-3'>
            <h2 id='related-products-heading' className='text-xl font-bold tracking-tight'>
              {t('catalog.relatedAccessories')}
            </h2>
            <Link
              href={relatedBrowseHref}
              className='text-sm font-medium text-primary hover:underline'
            >
              {t('catalog.browseMoreAccessories')}
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3'>
            {relatedProducts.map((item, index) => (
              <MarketplaceProductCard
                key={`${item.id}-${index}`}
                product={item}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
