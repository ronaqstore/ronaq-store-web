'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TruncateText } from '@/components/ui/truncate-text';
import { SmartImage } from '@/components/media/smart-image';
import {
  PLACEHOLDER_PRODUCT_IMAGE,
  productImageSrc,
  IMAGE_PLACEHOLDER_BLUR
} from '@/constants/placeholders';
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
import type { MarketplaceProduct } from '@/types/marketplace';

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmMmY0ZjciLz48L3N2Zz4=';

export function ProductCard({
  product,
  storeSlug,
  storeName,
  storeCity,
  onSelectProduct,
  priority = false,
  linkToModel = true,
  prefetch = true,
  priceLabelOverride,
  className
}: ProductCardProps) {
  const t = useTranslations();

  const title = formatProductCardTitle(product.name, product.brandName);
  const rawStorage = product.storage || product.specs?.storage;
  const storageLabel = formatStorageLabel(rawStorage);
  const rawRam = product.ram || product.specs?.ram;
  const ramLabel = rawRam ? `${rawRam} RAM` : '';
  const ramStorageLabel =
    rawRam && storageLabel ? `${rawRam} / ${storageLabel}` : storageLabel || ramLabel;
  const colorLabel = formatColorLabel(product.color || product.specs?.color);
  const batteryHealth =
    product.units?.find((u) => typeof u.batteryHealth === 'number')?.batteryHealth ?? null;

  const conditionLabel =
    product.condition === 'NEW'
      ? t('catalog.conditionNew')
      : product.condition === 'USED'
        ? t('catalog.conditionUsed')
        : product.condition
          ? formatTitleCase(product.condition)
          : '';

  const formattedPrice = priceLabelOverride ?? formatPrice(product.retailPrice);

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
  const isLowStock = product.availability === 'LOW_STOCK';

  const stockLabel = isOutOfStock
    ? t('catalog.outOfStock')
    : isLowStock
      ? stockCount != null && stockCount > 0
        ? t('catalog.lowStockCount', { count: stockCount })
        : t('catalog.lowStock')
      : stockCount != null && stockCount > 0
        ? product.trackingType === 'SERIALIZED' || unitsCount > 0
          ? t('catalog.inStockPhones', { count: stockCount })
          : t('catalog.inStockCount', { count: stockCount })
        : null;

  const shop = 'shop' in product ? (product as MarketplaceProduct).shop : undefined;

  const href = shop?.slug
    ? productPath(shop.slug, product.name, product.id)
    : storeSlug
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
    </>
  );

  const hasAuthenticity = Boolean(product.authenticity);

  const authenticityBadge =
    product.authenticity === 'ORIGINAL' ? (
      <Badge variant='success' className='px-1.5 py-0.5 text-[10px] font-semibold'>
        {t('catalog.authenticityOriginal')}
      </Badge>
    ) : product.authenticity === 'COPY' ? (
      <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-semibold'>
        {t('catalog.authenticityCopy')}
      </Badge>
    ) : null;

  const handleSelectProduct = () => {
    onSelectProduct?.(product);
  };

  const cardContent = (
    <>
      <div className='relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted/30'>
        {product.ptaStatus ? (
          <div className='absolute inset-s-3 top-3 z-10 flex flex-wrap gap-1.5'>{statusBadges}</div>
        ) : null}
        <SmartImage
          src={productImageSrc(product.primaryImageUrl)}
          alt={formatEmpty(title)}
          fill
          priority={priority}
          placeholder={IMAGE_PLACEHOLDER_BLUR}
          blurDataURL={BLUR_PLACEHOLDER}
          className='object-contain p-3 sm:p-5 transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:transform-none select-none'
          sizes='(max-width:639px) 50vw, (max-width:1023px) 33vw, (max-width:1535px) 25vw, 20vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />
      </div>

      <div className='flex flex-1 flex-col p-3 sm:p-4'>
        <div className='min-h-[1rem] mb-1'>
          {product.brandName ? (
            <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate'>
              {formatTitleCase(product.brandName)}
            </p>
          ) : null}
        </div>

        <h3 className='min-h-[2.25rem] text-xs font-semibold leading-snug text-foreground transition-colors duration-200 sm:min-h-[2.5rem] sm:text-sm md:min-h-[2.75rem] [@media(hover:hover)]:group-hover:text-emerald-600 dark:[@media(hover:hover)]:group-hover:text-emerald-400'>
          <TruncateText lines={2}>{title}</TruncateText>
        </h3>

        {hasAuthenticity || ramStorageLabel || colorLabel || batteryHealth || conditionLabel ? (
          <div className='flex flex-wrap items-center gap-1 mt-1.5'>
            {authenticityBadge}
            {ramStorageLabel ? (
              <Badge
                variant='outline'
                className='px-1.5 py-0.5 text-[10px] font-semibold bg-muted/60 text-foreground border-border'
              >
                {ramStorageLabel}
              </Badge>
            ) : null}
            {colorLabel ? (
              <Badge
                variant='outline'
                className='px-1.5 py-0.5 text-[10px] font-medium bg-muted/40 text-muted-foreground border-border'
              >
                {colorLabel}
              </Badge>
            ) : null}
            {batteryHealth ? (
              <Badge
                variant='outline'
                className='px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
              >
                {t('catalog.batteryPct', { pct: batteryHealth })}
              </Badge>
            ) : null}
            {conditionLabel ? (
              <Badge variant='outline' className='px-1.5 py-0.5 text-[10px] font-medium'>
                {conditionLabel}
              </Badge>
            ) : null}
          </div>
        ) : null}

        {shop || storeName ? (
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground pt-1 pb-1 truncate'>
            <Icons.store className='h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400' />
            <span className='truncate font-medium'>
              {shop?.displayName ?? storeName}
              {(shop?.city ?? storeCity) ? ` · ${shop?.city ?? storeCity}` : ''}
            </span>
          </div>
        ) : null}

        {!shop && product.categoryName ? (
          <p className='text-xs text-muted-foreground truncate pt-0.5 pb-1'>
            {formatTitleCase(product.categoryName)}
          </p>
        ) : null}

        <div className='mt-auto flex flex-wrap items-center justify-between gap-x-1.5 gap-y-2 pt-2.5 border-t border-border/50'>
          <span className='min-w-fit whitespace-nowrap text-xs sm:text-sm md:text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums'>
            {formattedPrice || t('catalog.price')}
          </span>

          {isOutOfStock ? (
            <div className='ms-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground'>
              <span className='h-1.5 w-1.5 rounded-full bg-muted-foreground/60' />
              <span className='hidden min-[360px]:inline'>{t('catalog.outOfStock')}</span>
            </div>
          ) : isLowStock ? (
            <div className='ms-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
              <span className='hidden min-[360px]:inline'>
                {stockLabel ?? t('catalog.lowStock')}
              </span>
            </div>
          ) : (
            <div className='ms-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              <span className='hidden min-[360px]:inline'>
                {stockLabel ?? t('catalog.inStock')}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none active:scale-[0.99]',
        className
      )}
    >
      {href ? (
        <Link
          href={href}
          prefetch={prefetch}
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
