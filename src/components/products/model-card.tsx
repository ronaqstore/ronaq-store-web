'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import {
  formatEmpty,
  formatPrice,
  formatProductCardTitle,
  formatTitleCase
} from '@/lib/formatters';
import { TruncateText } from '@/components/ui/truncate-text';
import { modelPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { ModelCardProps } from '@/types/product';

export function ModelCard({ model, storeSlug, priority = false }: ModelCardProps) {
  const t = useTranslations();
  const href = modelPath(storeSlug, model.key);
  const title = formatProductCardTitle(model.model, model.brand);
  const priceLabel = model.fromPrice
    ? t('catalog.fromPrice', { price: formatPrice(model.fromPrice) })
    : null;

  const stockLabel =
    model.availability === 'OUT_OF_STOCK'
      ? t('catalog.outOfStock')
      : model.variantCount > 0
        ? t('catalog.variantCount', { count: model.variantCount })
        : null;

  return (
    <Card className='group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-none transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:rounded-2xl'>
      <div className='relative aspect-square w-full overflow-hidden bg-muted/25 sm:aspect-[4/3]'>
        <PreviewableImage
          src={model.coverImage}
          alt={`${formatTitleCase(model.brand)} ${title}`}
          priority={priority}
          className='absolute inset-0 h-full w-full'
          imageClassName='object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04] sm:p-5'
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />
      </div>
      <Link
        href={href}
        className='flex flex-1 cursor-pointer flex-col gap-1.5 p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-2 sm:p-3.5'
      >
        <p className='text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase sm:text-[11px]'>
          {formatEmpty(formatTitleCase(model.brand))}
        </p>
        <TruncateText
          lines={2}
          className='text-[13px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm'
        >
          {title}
        </TruncateText>
        {stockLabel ? (
          <p
            className={cn(
              'text-[11px] font-medium sm:text-xs',
              model.availability === 'OUT_OF_STOCK'
                ? 'text-destructive'
                : 'text-emerald-700 dark:text-emerald-400'
            )}
          >
            {stockLabel}
          </p>
        ) : null}
        {priceLabel ? (
          <p className='mt-auto pt-1.5 text-sm font-extrabold tracking-tight text-primary tabular-nums sm:text-base'>
            {priceLabel}
          </p>
        ) : (
          <div className='mt-auto pt-1.5' />
        )}
      </Link>
    </Card>
  );
}
