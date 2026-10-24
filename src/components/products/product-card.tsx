'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_PRODUCT_IMAGE, productImageSrc } from '@/constants/placeholders';
import {
  formatPrice,
  formatEmpty,
  formatProductCardTitle,
  formatStorageLabel,
  formatColorLabel,
  formatTitleCase
} from '@/lib/formatters';
import { modelPath, productPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { ProductCardProps } from '@/types/product';

export function ProductCard({
  product,
  storeSlug,
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
      ? t('catalog.conditionNew')
      : product.condition === 'USED'
        ? t('catalog.conditionUsed')
        : product.condition
          ? formatTitleCase(product.condition)
          : '';

  const formattedPrice = formatPrice(product.retailPrice);

  const unitsCount = product.units?.length ?? 0;
  const stockCount =
    product.stockCount != null && product.stockCount > 0
      ? product.stockCount
      : unitsCount > 0
        ? unitsCount
        : product.totalQuantity > 0
          ? product.totalQuantity
          : null;

  const isOutOfStock = product.availability === 'OUT_OF_STOCK';

  const stockLabel =
    stockCount != null && stockCount > 0
      ? product.trackingType === 'SERIALIZED' || unitsCount > 0
        ? t('catalog.inStockPhones', { count: stockCount })
        : t('catalog.inStockCount', { count: stockCount })
      : isOutOfStock
        ? t('catalog.outOfStock')
        : null;

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

  const handleSelectProduct = () => {
    onSelectProduct?.(product);
  };

  const cardContent = (
    <>
      <div className='relative aspect-square w-full overflow-hidden bg-muted/20'>
        <SmartImage
          src={productImageSrc(product.primaryImageUrl)}
          alt={formatEmpty(title)}
          fill
          priority={priority}
          className={cn(
            'object-cover transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none select-none',
            isOutOfStock ? 'grayscale opacity-80' : ''
          )}
          sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />

        {isOutOfStock ? (
          <span className='absolute inset-s-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 border border-border/60 shadow-xs backdrop-blur-xs'>
            <span className='h-1.5 w-1.5 rounded-full bg-rose-500' />
            <span>{t('catalog.outOfStock')}</span>
          </span>
        ) : null}
      </div>

      <div className='flex flex-1 flex-col p-2.5 sm:p-3.5 md:p-4'>
        {hasStatusBadges ? (
          <div className='flex flex-wrap items-center gap-1 mb-1.5'>{statusBadges}</div>
        ) : null}

        <div className='min-h-[1rem] mb-1'>
          {product.brandName ? (
            <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate'>
              {formatTitleCase(product.brandName)}
            </p>
          ) : null}
        </div>

        <h3 className='text-xs sm:text-sm font-semibold leading-snug text-foreground line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem] transition-colors duration-200 [@media(hover:hover)]:group-hover:text-emerald-600 dark:[@media(hover:hover)]:group-hover:text-emerald-400'>
          {title}
        </h3>

        {specParts.length > 0 ? (
          <p className='text-[11px] text-muted-foreground truncate pt-0.5 pb-2'>
            {specParts.join(' · ')}
          </p>
        ) : product.categoryName ? (
          <p className='text-[11px] text-muted-foreground truncate pt-0.5 pb-2'>
            {formatTitleCase(product.categoryName)}
          </p>
        ) : null}

        <div className='mt-auto flex items-center justify-between gap-1.5 pt-2.5 border-t border-border/50'>
          <span className='text-xs sm:text-sm md:text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums'>
            {formattedPrice || t('catalog.price')}
          </span>

          {isOutOfStock ? (
            <div className='inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-muted-foreground/60' />
              <span>{t('catalog.outOfStock')}</span>
            </div>
          ) : (
            <div className='inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              <span>{stockLabel ?? t('catalog.inStock')}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Card className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none'>
      {href ? (
        <Link
          href={href}
          className='flex flex-1 flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
        >
          {cardContent}
        </Link>
      ) : (
        <button
          type='button'
          className='flex flex-1 flex-col text-start rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
          onClick={handleSelectProduct}
        >
          {cardContent}
        </button>
      )}
    </Card>
  );
}
