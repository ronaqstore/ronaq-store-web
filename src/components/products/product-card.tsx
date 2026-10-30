'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  onSelectProduct,
  priority = false,
  linkToModel = true,
  prefetch = true,
  className
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

  const hasStatusBadges = Boolean(product.ptaStatus);

  const authenticityBadge =
    product.authenticity === 'ORIGINAL' ? (
      <span className='absolute inset-e-2 top-2 z-10 inline-flex items-center rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-xs backdrop-blur-xs dark:text-emerald-400'>
        {t('catalog.authenticityOriginal')}
      </span>
    ) : product.authenticity === 'COPY' ? (
      <span className='absolute inset-e-2 top-2 z-10 inline-flex items-center rounded-full border border-border/60 bg-muted/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-xs backdrop-blur-xs'>
        {t('catalog.authenticityCopy')}
      </span>
    ) : null;

  const specParts = [storageLabel, colorLabel, conditionLabel].filter(Boolean);

  const handleSelectProduct = () => {
    onSelectProduct?.(product);
  };

  const cardContent = (
    <>
      <div className='relative aspect-square w-full shrink-0 overflow-hidden bg-muted/20'>
        <SmartImage
          src={productImageSrc(product.primaryImageUrl)}
          alt={formatEmpty(title)}
          fill
          priority={priority}
          placeholder={IMAGE_PLACEHOLDER_BLUR}
          blurDataURL={BLUR_PLACEHOLDER}
          className={cn(
            'object-cover transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none select-none',
            isOutOfStock ? 'grayscale opacity-80' : ''
          )}
          sizes='(max-width:639px) 50vw, (max-width:1023px) 33vw, (max-width:1535px) 25vw, 20vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />

        {isOutOfStock ? (
          <span className='absolute inset-s-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-rose-600 shadow-xs backdrop-blur-xs dark:text-rose-400'>
            <span className='h-1.5 w-1.5 rounded-full bg-rose-500' />
            <span>{t('catalog.outOfStock')}</span>
          </span>
        ) : isLowStock ? (
          <span className='absolute inset-s-2 top-2 z-10 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-amber-700 shadow-xs backdrop-blur-xs dark:text-amber-300'>
            <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
            <span>{t('catalog.lowStock')}</span>
          </span>
        ) : null}
        {authenticityBadge}
      </div>

      <div className='flex flex-1 flex-col p-3 sm:p-4'>
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

        {shop ? (
          <div className='flex items-center gap-1 text-xs text-muted-foreground pt-1 pb-1.5 truncate'>
            <Icons.store className='h-3.5 w-3.5 shrink-0 text-muted-foreground/70' />
            <span className='truncate'>
              {shop.displayName}
              {shop.city ? ` · ${shop.city}` : ''}
            </span>
          </div>
        ) : specParts.length > 0 ? (
          <p className='text-xs text-muted-foreground truncate pt-0.5 pb-1'>
            {specParts.join(' · ')}
          </p>
        ) : product.categoryName ? (
          <p className='text-xs text-muted-foreground truncate pt-0.5 pb-1'>
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
              <span className='hidden min-[360px]:inline'>{t('catalog.outOfStock')}</span>
            </div>
          ) : isLowStock ? (
            <div className='inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300'>
              <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
              <span className='hidden min-[360px]:inline'>{stockLabel ?? t('catalog.lowStock')}</span>
            </div>
          ) : (
            <div className='inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
              <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
              <span className='hidden min-[360px]:inline'>{stockLabel ?? t('catalog.inStock')}</span>
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
