'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import { formatPrice, formatEmpty } from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import { cn } from '@/lib/utils';
import type { ProductDetailModalProps } from '@/types/product';

export function ProductDetailModal({
  product,
  onClose
}: ProductDetailModalProps) {
  const t = useTranslations();

  if (!product) return null;

  const formattedPrice = formatPrice(product.retailPrice);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in'>
      <div className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl p-6'>
        <button
          type='button'
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'absolute inset-e-4 top-4 h-8 w-8 rounded-full'
          )}
          onClick={onClose}
          aria-label={t('aria.closeModal')}
        >
          <Icons.close className='h-4 w-4' />
        </button>

        <div className='space-y-6'>
          <PreviewableImage
            src={product.images?.[0]?.url ?? null}
            alt={formatEmpty(product.name)}
            className='relative h-64 w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30 sm:h-80'
            imageClassName='object-contain p-6'
            sizes='(max-width: 768px) 100vw, 600px'
            fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
          />

          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline'>{formatEmpty(product.categoryName)}</Badge>
              <Badge variant='secondary'>{formatEmpty(product.brandName)}</Badge>
              {product.ptaStatus === 'APPROVED' ? (
                <Badge variant='success'>{t('catalog.ptaApproved')}</Badge>
              ) : null}
              {product.authenticity === 'ORIGINAL' ? (
                <Badge variant='success'>{t('catalog.authenticityOriginal')}</Badge>
              ) : null}
              {product.authenticity === 'COPY' ? (
                <Badge variant='secondary'>{t('catalog.authenticityCopy')}</Badge>
              ) : null}
              <StockBadge availability={product.availability} stockCount={product.stockCount} />
            </div>

            <h2 className='text-2xl font-bold text-foreground'>{formatEmpty(product.name)}</h2>

            {formattedPrice ? (
              <div className='text-3xl font-extrabold text-primary'>{formattedPrice}</div>
            ) : null}

            <div className='space-y-1.5 pt-2 border-t border-border/50'>
              <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('catalog.description')}
              </h4>
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

        </div>
      </div>
    </div>
  );
}
