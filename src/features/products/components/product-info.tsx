'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ProductBreadcrumb } from './product-breadcrumb';
import { SellerCard } from './seller-card';
import {
  formatPrice,
  buildWhatsAppLink,
  formatEmpty,
  formatPhone,
  formatTitleCase,
  formatStorageLabel,
  formatColorLabel,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import {
  productConditionMessageKey,
  resolveProductCondition
} from '@/lib/product-condition';
import { cn } from '@/lib/utils';
import type { ProductInfoProps } from '@/types/product';

export function ProductInfo({ product, store, slug, crumbs }: ProductInfoProps) {
  const t = useTranslations('catalog');
  const tWhatsapp = useTranslations('whatsapp');

  const storeName = store.displayName || store.name;
  const whatsappNumber = resolveStoreWhatsAppNumber(store);
  const contactNumber = store.phoneNumber?.trim() || '';

  const isOutOfStock = product.availability === 'OUT_OF_STOCK';
  const isLowStock = product.availability === 'LOW_STOCK';
  const displayTitle = product.name;
  const storageLabel = formatStorageLabel(product.storage);
  const colorLabel = formatColorLabel(product.color);
  const ramLabel = product.ram ? formatStorageLabel(product.ram) : null;
  const formattedPrice = formatPrice(product.retailPrice);

  const condition = resolveProductCondition(product);
  const conditionLabel = condition
    ? t(productConditionMessageKey(condition))
    : null;

  const specDetails = [storageLabel, colorLabel].filter(Boolean).join(', ');
  const fullProductName = specDetails
    ? `${displayTitle} (${specDetails})`
    : displayTitle;
  const whatsappPrice = formattedPrice ?? '';

  const whatsappMessage = isOutOfStock
    ? tWhatsapp('inquireProduct', {
        storeName,
        productName: fullProductName,
        price: whatsappPrice
      })
    : tWhatsapp('buyProduct', {
        storeName,
        productName: fullProductName,
        price: whatsappPrice
      });

  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, whatsappMessage)
    : null;
  const contactHref = contactNumber ? `tel:${contactNumber}` : null;

  return (
    <div className='flex flex-col min-w-0'>
      <ProductBreadcrumb crumbs={crumbs} />

      {product.brandName ? (
        <div className='mb-1.5'>
          <Link
            href={`/shop/${slug}?q=${encodeURIComponent(product.brandName)}`}
            className='inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 rtl:normal-case rtl:tracking-normal'
          >
            {formatTitleCase(product.brandName)}
          </Link>
        </div>
      ) : null}

      <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-bold tracking-tight text-foreground leading-tight break-words mb-3'>
        {displayTitle}
      </h1>

      <div className='flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3'>
        {product.categoryName ? (
          <Link
            href={`/shop/${slug}?category=${encodeURIComponent(product.categoryId || product.categoryName)}`}
          >
            <Badge variant='outline' className='hover:bg-muted transition-colors cursor-pointer text-[11px] sm:text-xs font-semibold'>
              {formatEmpty(product.categoryName)}
            </Badge>
          </Link>
        ) : null}

        {product.ptaStatus === 'APPROVED' ? (
          <Badge variant='success' className='gap-1 text-[11px] sm:text-xs font-semibold'>
            <Icons.shieldCheck className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400' />
            {t('ptaApproved')}
          </Badge>
        ) : null}

        {product.ptaStatus === 'NON_PTA' ? (
          <Badge variant='warning' className='text-[11px] sm:text-xs font-semibold'>
            {t('ptaNon')}
          </Badge>
        ) : null}

        {product.ptaStatus === 'JV' ? (
          <Badge variant='secondary' className='text-[11px] sm:text-xs font-semibold'>
            {t('ptaJv')}
          </Badge>
        ) : null}

        {product.ptaStatus === 'BYPASS' ? (
          <Badge variant='secondary' className='text-[11px] sm:text-xs font-semibold'>
            {t('ptaBypass')}
          </Badge>
        ) : null}

        {product.ptaStatus === 'MDM_BYPASS' ? (
          <Badge variant='secondary' className='text-[11px] sm:text-xs font-semibold'>
            {t('ptaMdmBypass')}
          </Badge>
        ) : null}

        {conditionLabel ? (
          <Badge variant='secondary' className='text-[11px] sm:text-xs font-semibold'>
            {conditionLabel}
          </Badge>
        ) : null}

        {product.authenticity === 'ORIGINAL' ? (
          <Badge variant='success' className='text-[11px] sm:text-xs font-semibold'>
            {t('authenticityOriginal')}
          </Badge>
        ) : null}

        {product.authenticity === 'COPY' ? (
          <Badge variant='secondary' className='text-[11px] sm:text-xs font-semibold'>
            {t('authenticityCopy')}
          </Badge>
        ) : null}
      </div>

      <div className='flex flex-wrap items-baseline justify-between gap-3 rounded-2xl bg-muted/20 p-3.5 sm:p-4 border border-border/60 mb-3'>
        <div className='min-w-0'>
          <span className='block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground rtl:normal-case rtl:tracking-normal'>
            {t('price')}
          </span>
          <div className='flex items-baseline gap-2 pt-0.5'>
            <span className='text-2xl sm:text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums leading-tight'>
              {formattedPrice || t('price')}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 self-center shrink-0'>
          {isOutOfStock ? (
            <div className='inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400'>
              <span className='relative flex h-2 w-2'>
                <span className='h-2 w-2 rounded-full bg-rose-500' />
              </span>
              <span>{t('outOfStock')}</span>
            </div>
          ) : isLowStock ? (
            <div className='inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-amber-500' />
              </span>
              <span>
                {product.stockCount != null
                  ? t('lowStockCount', { count: product.stockCount })
                  : t('lowStock')}
              </span>
            </div>
          ) : (
            <div className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-600' />
              </span>
              <span>
                {product.stockCount != null
                  ? t('inStockCount', { count: product.stockCount })
                  : t('inStock')}
              </span>
            </div>
          )}
        </div>
      </div>

      {(ramLabel || storageLabel || colorLabel) ? (
        <div className='mb-4'>
          <span className='block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 rtl:normal-case rtl:tracking-normal'>
            {t('keyHighlights')}
          </span>
          <div className='flex flex-wrap gap-1.5 sm:gap-2'>
            {ramLabel ? (
              <div className='inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-foreground shadow-xs'>
                <span className='text-muted-foreground'>{t('ram')}:</span>
                <span className='text-foreground'>{ramLabel}</span>
              </div>
            ) : null}
            {storageLabel ? (
              <div className='inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-foreground shadow-xs'>
                <span className='text-muted-foreground'>{t('storage')}:</span>
                <span className='text-foreground'>{storageLabel}</span>
              </div>
            ) : null}
            {colorLabel ? (
              <div className='inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold text-foreground shadow-xs'>
                <span className='text-muted-foreground'>{t('color')}:</span>
                <span className='text-foreground'>{colorLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {isOutOfStock ? (
        <div className='flex items-start gap-2.5 sm:gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 sm:p-3.5 text-xs sm:text-sm text-rose-800 dark:text-rose-200 mb-4'>
          <Icons.warning className='h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5' />
          <p className='leading-snug'>{t('outOfStockBanner')}</p>
        </div>
      ) : null}

      <div className='flex flex-col gap-3 mb-5'>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full gap-2.5 h-11 sm:h-12 min-h-[44px] rounded-xl text-sm sm:text-base font-bold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.99] [@media(hover:hover)]:hover:shadow-md',
              isOutOfStock
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-emerald-600 hover:bg-emerald-700'
            )}
          >
            <Icons.whatsapp className='h-5 w-5 shrink-0' />
            <span className='truncate'>
              {isOutOfStock ? t('askAvailabilityWhatsApp') : t('orderOnWhatsApp')}
            </span>
          </a>
        ) : null}

        {contactHref ? (
          <a
            href={contactHref}
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'w-full gap-2.5 h-11 sm:h-12 min-h-[44px] rounded-xl text-sm sm:text-base font-bold border-border/80 hover:bg-muted/60 transition-colors'
            )}
          >
            <Icons.phone className='h-4 w-4 shrink-0 text-muted-foreground' />
            <span className='truncate'>{t('callShop', { phone: formatPhone(contactNumber) })}</span>
          </a>
        ) : null}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-2 rounded-2xl border border-border/80 bg-muted/20 p-3 mt-1 mb-4'>
        <div className='flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1 p-1'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
            <Icons.shieldCheck className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <span className='block text-xs font-bold text-foreground leading-tight'>
              {t('trustQualityChecked')}
            </span>
            <span className='text-[10px] sm:text-[11px] text-muted-foreground leading-tight'>
              {t('trustQualityCheckedDesc')}
            </span>
          </div>
        </div>

        <div className='flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1 p-1 sm:border-x border-border/60'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
            <Icons.badgeCheck className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <span className='block text-xs font-bold text-foreground leading-tight'>
              {t('trustPtaVerified')}
            </span>
            <span className='text-[10px] sm:text-[11px] text-muted-foreground leading-tight'>
              {t('trustPtaVerifiedDesc')}
            </span>
          </div>
        </div>

        <div className='flex items-center sm:flex-col sm:text-center gap-2.5 sm:gap-1 p-1'>
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'>
            <Icons.truck className='h-4 w-4' />
          </div>
          <div className='min-w-0'>
            <span className='block text-xs font-bold text-foreground leading-tight'>
              {t('trustShopPickup')}
            </span>
            <span className='text-[10px] sm:text-[11px] text-muted-foreground leading-tight'>
              {t('trustShopPickupDesc')}
            </span>
          </div>
        </div>
      </div>

      <SellerCard store={store} slug={slug} />
    </div>
  );
}
