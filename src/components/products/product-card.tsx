'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import {
  formatPrice,
  buildWhatsAppLink,
  formatEmpty,
  formatProductCardTitle,
  formatStorageLabel,
  formatColorLabel,
  formatTitleCase
} from '@/lib/formatters';
import { TruncateText } from '@/components/ui/truncate-text';
import { modelPath, productPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { ProductCardProps } from '@/types/product';

export function ProductCard({
  product,
  storeSlug,
  storeName,
  storePhone,
  onSelectProduct,
  priority = false,
  linkToModel = true
}: ProductCardProps) {
  const t = useTranslations();

  const title = formatProductCardTitle(product.name, product.brandName);
  const storageLabel = formatStorageLabel(product.storage);
  const colorLabel = formatColorLabel(product.color);
  const conditionLabel =
    product.condition === 'NEW'
      ? t('catalog.brandNew')
      : product.condition === 'USED'
        ? t('catalog.used')
        : product.condition
          ? formatTitleCase(product.condition)
          : '';

  const formattedPrice = product.contactForPrice
    ? t('catalog.contactForPrice')
    : formatPrice(product.retailPrice);

  const unitsCount = product.units?.length ?? 0;
  const stockCount =
    product.stockCount != null && product.stockCount > 0
      ? product.stockCount
      : unitsCount > 0
        ? unitsCount
        : product.totalQuantity > 0
          ? product.totalQuantity
          : null;

  const stockLabel =
    stockCount != null && stockCount > 0
      ? product.trackingType === 'SERIALIZED' || unitsCount > 0
        ? t('catalog.inStockPhones', { count: stockCount })
        : t('catalog.inStockCount', { count: stockCount })
      : product.availability === 'OUT_OF_STOCK'
        ? t('catalog.outOfStock')
        : null;

  const specForWhatsApp = [storageLabel, colorLabel].filter(Boolean).join(', ');
  const fullProductName = specForWhatsApp ? `${title} (${specForWhatsApp})` : title;

  const whatsappMessage = t('whatsapp.inquireProduct', {
    storeName,
    productName: fullProductName,
    price: formattedPrice
  });
  const whatsappHref = buildWhatsAppLink(storePhone, whatsappMessage);
  const href = storeSlug
    ? linkToModel && product.trackingType === 'SERIALIZED' && product.modelKey
      ? modelPath(storeSlug, product.modelKey)
      : productPath(storeSlug, product.name, product.id)
    : undefined;

  const statusBadges = (
    <>
      {product.ptaStatus === 'APPROVED' ? (
        <Badge variant='success' className='gap-1 px-1.5 py-0.5 text-[10px] font-semibold'>
          <Icons.shieldCheck className='h-3 w-3' />
          {t('catalog.ptaApproved')}
        </Badge>
      ) : null}
      {product.ptaStatus === 'NON_PTA' ? (
        <Badge variant='warning' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.ptaNon')}
        </Badge>
      ) : null}
      {product.ptaStatus === 'JV' ? (
        <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.ptaJv')}
        </Badge>
      ) : null}
      {product.ptaStatus === 'BYPASS' ? (
        <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.ptaBypass')}
        </Badge>
      ) : null}
      {product.ptaStatus === 'MDM_BYPASS' ? (
        <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.ptaMdmBypass')}
        </Badge>
      ) : null}
      {product.authenticity === 'ORIGINAL' ? (
        <Badge variant='success' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.authenticityOriginal')}
        </Badge>
      ) : null}
      {product.authenticity === 'COPY' ? (
        <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-semibold'>
          {t('catalog.authenticityCopy')}
        </Badge>
      ) : null}
    </>
  );

  const hasStatusBadges =
    Boolean(product.ptaStatus) ||
    product.authenticity === 'ORIGINAL' ||
    product.authenticity === 'COPY';

  const specParts = [storageLabel, colorLabel, conditionLabel].filter(Boolean);

  const details = (
    <div className='flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-3.5'>
      {hasStatusBadges ? (
        <div className='flex flex-wrap items-center gap-1'>{statusBadges}</div>
      ) : null}

      {product.brandName ? (
        <p className='text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:text-[11px]'>
          {formatTitleCase(product.brandName)}
        </p>
      ) : null}

      <TruncateText
        lines={2}
        className='text-[13px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm'
      >
        {title}
      </TruncateText>

      {specParts.length > 0 ? (
        <p className='text-[11px] leading-relaxed text-muted-foreground sm:text-xs'>
          {specParts.join(' · ')}
        </p>
      ) : product.categoryName ? (
        <p className='text-[11px] text-muted-foreground sm:text-xs'>
          {formatTitleCase(product.categoryName)}
        </p>
      ) : null}

      {stockLabel ? (
        <p
          className={cn(
            'text-[11px] font-medium sm:text-xs',
            product.availability === 'OUT_OF_STOCK'
              ? 'text-destructive'
              : 'text-emerald-700 dark:text-emerald-400'
          )}
        >
          {stockLabel}
        </p>
      ) : null}

      <div className='mt-auto flex items-end justify-between gap-2 pt-1.5'>
        <p
          className={cn(
            'text-sm font-extrabold tracking-tight tabular-nums sm:text-base',
            product.contactForPrice ? 'text-foreground' : 'text-primary'
          )}
        >
          {formattedPrice}
        </p>
      </div>
    </div>
  );

  return (
    <Card className='group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-none transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:rounded-2xl'>
      <div className='relative aspect-square w-full overflow-hidden bg-muted/25 sm:aspect-[4/3]'>
        <PreviewableImage
          src={product.primaryImageUrl}
          alt={formatEmpty(title)}
          priority={priority}
          className='absolute inset-0 h-full w-full'
          imageClassName='object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04] sm:p-5'
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />
      </div>

      {href ? (
        <Link
          href={href}
          className='flex flex-1 cursor-pointer flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          {details}
        </Link>
      ) : (
        <button
          type='button'
          className='flex flex-1 cursor-pointer flex-col text-start'
          onClick={() => onSelectProduct?.(product)}
        >
          {details}
        </button>
      )}

      {product.contactForPrice && storePhone ? (
        <div className='px-3 pb-3 sm:px-3.5 sm:pb-3.5'>
          <a
            href={whatsappHref}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(
              buttonVariants({ size: 'sm' }),
              'h-8 w-full gap-1.5 bg-emerald-600 text-[11px] text-white shadow-sm hover:bg-emerald-700 sm:text-xs'
            )}
          >
            <Icons.whatsapp className='h-3.5 w-3.5' />
            {t('catalog.inquireWhatsApp')}
          </a>
        </div>
      ) : null}
    </Card>
  );
}
