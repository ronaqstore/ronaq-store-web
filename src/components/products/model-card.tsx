'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import { SmartImage } from '@/components/media/smart-image';
import { TruncateText } from '@/components/ui/truncate-text';
import {
  PLACEHOLDER_PRODUCT_IMAGE,
  IMAGE_PLACEHOLDER_BLUR
} from '@/constants/placeholders';
import {
  formatEmpty,
  formatPrice,
  formatProductCardTitle,
  formatTitleCase
} from '@/lib/formatters';
import { modelPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { ModelCardProps } from '@/types/product';

const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmMmY0ZjciLz48L3N2Zz4=';

export function ModelCard({ model, storeSlug, priority = false }: ModelCardProps) {
  const t = useTranslations();
  const href = modelPath(storeSlug, model.key);
  const title = formatProductCardTitle(model.model, model.brand);
  const isOutOfStock = model.availability === 'OUT_OF_STOCK';
  const priceLabel = model.fromPrice
    ? t('catalog.fromPrice', { price: formatPrice(model.fromPrice) })
    : t('catalog.price');
  const stockLabel =
    model.variantCount > 0
      ? t('catalog.variantCount', { count: model.variantCount })
      : isOutOfStock
        ? t('catalog.outOfStock')
        : null;

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200',
        '[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md',
        'motion-reduce:transition-none motion-reduce:hover:transform-none active:scale-[0.99]'
      )}
    >
      <Link
        href={href}
        className='flex flex-1 flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
      >
        <div className='relative aspect-square w-full shrink-0 overflow-hidden bg-muted/20'>
          <SmartImage
            src={model.coverImage || PLACEHOLDER_PRODUCT_IMAGE}
            alt={`${formatTitleCase(model.brand)} ${title}`}
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
          ) : null}
        </div>

        <div className='flex flex-1 flex-col p-3 sm:p-4'>
          <div className='mb-1 min-h-[1rem]'>
            {model.brand ? (
              <p className='truncate text-[10px] font-bold tracking-wider text-muted-foreground uppercase'>
                {formatTitleCase(model.brand)}
              </p>
            ) : null}
          </div>

          <div className='min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem]'>
            <TruncateText
              lines={2}
              className='text-xs font-semibold leading-snug text-foreground transition-colors duration-200 sm:text-sm [@media(hover:hover)]:group-hover:text-emerald-600 dark:[@media(hover:hover)]:group-hover:text-emerald-400'
            >
              {formatEmpty(title)}
            </TruncateText>
          </div>

          <div className='mt-auto flex items-center justify-between gap-1.5 border-t border-border/50 pt-2.5'>
            <span className='text-xs font-extrabold text-emerald-600 tabular-nums sm:text-sm md:text-base dark:text-emerald-400'>
              {priceLabel}
            </span>
            {isOutOfStock ? (
              <div className='inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground'>
                <span className='h-1.5 w-1.5 rounded-full bg-muted-foreground/60' />
                <span className='hidden min-[360px]:inline'>{t('catalog.outOfStock')}</span>
              </div>
            ) : stockLabel ? (
              <div className='inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                <span className='hidden min-[360px]:inline'>{stockLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </Card>
  );
}
