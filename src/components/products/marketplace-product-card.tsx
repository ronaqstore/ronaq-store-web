'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_PRODUCT_IMAGE, productImageSrc } from '@/constants/placeholders';
import { formatPrice, formatEmpty, formatProductCardTitle } from '@/lib/formatters';
import { productPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { MarketplaceProductCardProps } from '@/types/marketplace';

export function MarketplaceProductCard({
  product,
  priority = false
}: MarketplaceProductCardProps) {
  const t = useTranslations('catalog');
  const title = formatProductCardTitle(product.name, product.brandName);
  const formattedPrice = formatPrice(product.retailPrice);
  const href = productPath(product.shop.slug, product.name, product.id);
  const isOutOfStock = product.availability === 'OUT_OF_STOCK';

  return (
    <Card className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none'>
      <Link
        href={href}
        className='flex flex-1 flex-col rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
      >
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
              <span>{t('outOfStock')}</span>
            </span>
          ) : null}
        </div>

        <div className='flex flex-1 flex-col p-2.5 sm:p-3.5 md:p-4'>
          <div className='min-h-[1rem] mb-1'>
            {product.brandName ? (
              <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate'>
                {product.brandName}
              </p>
            ) : null}
          </div>

          <h3 className='text-xs sm:text-sm font-semibold leading-snug text-foreground line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem] transition-colors duration-200 [@media(hover:hover)]:group-hover:text-emerald-600 dark:[@media(hover:hover)]:group-hover:text-emerald-400'>
            {title}
          </h3>

          <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-1.5 pb-2.5 truncate'>
            <Icons.store className='h-3 w-3 shrink-0 text-muted-foreground/70' />
            <span className='truncate'>
              {product.shop.displayName}
              {product.shop.city ? ` · ${product.shop.city}` : ''}
            </span>
          </div>

          <div className='mt-auto flex items-center justify-between gap-1.5 pt-2.5 border-t border-border/50'>
            <span className='text-xs sm:text-sm md:text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums'>
              {formattedPrice || t('price')}
            </span>

            {isOutOfStock ? (
              <div className='inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground'>
                <span className='h-1.5 w-1.5 rounded-full bg-muted-foreground/60' />
                <span>{t('outOfStock')}</span>
              </div>
            ) : (
              <div className='inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                <span>{t('inStock')}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
