'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import { formatEmpty, formatPrice } from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import { modelPath } from '@/lib/seo/slug';
import type { ModelCardProps } from '@/types/product';

export function ModelCard({ model, storeSlug, priority = false }: ModelCardProps) {
  const t = useTranslations();
  const href = modelPath(storeSlug, model.key);
  const priceLabel = model.contactForPrice
    ? t('catalog.contactForPrice')
    : model.fromPrice
      ? t('catalog.fromPrice', { price: formatPrice(model.fromPrice) })
      : t('catalog.contactForPrice');

  return (
    <Link
      href={href}
      className='block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <Card className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg'>
        <div className='relative h-44 w-full overflow-hidden border-b border-border/50 bg-muted/40'>
          <PreviewableImage
            src={model.coverImage}
            alt={`${model.brand} ${model.model}`}
            priority={priority}
            className='absolute inset-0 h-full w-full'
            imageClassName='object-contain p-4 transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          />
          <div className='pointer-events-none absolute top-2.5 inset-e-2.5'>
            <StockBadge availability={model.availability} stockCount={null} />
          </div>
        </div>
        <div className='space-y-2 p-4'>
          <p className='text-xs text-muted-foreground'>{formatEmpty(model.brand)}</p>
          <h3 className='line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary'>
            {formatEmpty(model.model)}
          </h3>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='secondary' className='text-[10px]'>
              {t('catalog.variantCount', { count: model.variantCount })}
            </Badge>
          </div>
          <p className='pt-1 text-lg font-extrabold tracking-tight text-primary'>{priceLabel}</p>
        </div>
      </Card>
    </Link>
  );
}
