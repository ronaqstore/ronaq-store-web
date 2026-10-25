'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_PRODUCT_IMAGE, productImageSrc } from '@/constants/placeholders';
import { formatPrice, formatEmpty, formatProductCardTitle } from '@/lib/formatters';
import { productPath } from '@/lib/seo/slug';
import { cn } from '@/lib/utils';
import type { RelatedProductsProps } from '@/types/product';

export function RelatedProducts({ products, browseHref }: RelatedProductsProps) {
  const t = useTranslations('catalog');

  if (!products || products.length === 0) return null;

  const sortedProducts = [...products].sort((a, b) => {
    const aOut = a.availability === 'OUT_OF_STOCK' ? 1 : 0;
    const bOut = b.availability === 'OUT_OF_STOCK' ? 1 : 0;
    return aOut - bOut;
  });

  return (
    <section aria-labelledby='related-products-heading' className='w-full space-y-4 pt-2 md:pt-4'>
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3'>
        <div>
          <h2 id='related-products-heading' className='text-lg sm:text-xl md:text-2xl 2xl:text-3xl font-bold tracking-tight text-foreground'>
            {t('relatedAccessories')}
          </h2>
        </div>
        <Link
          href={browseHref}
          className='inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0'
        >
          <span>{t('browseMoreAccessories')}</span>
          <Icons.chevronRight className='h-4 w-4 rtl:rotate-180' />
        </Link>
      </div>

      <div className='grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6 w-full'>
        {sortedProducts.map((item, index) => {
          const title = formatProductCardTitle(item.name, item.brandName);
          const formattedPrice = formatPrice(item.retailPrice);
          const href = productPath(item.shop.slug, item.name, item.id);
          const isOutOfStock = item.availability === 'OUT_OF_STOCK';

          return (
            <div
              key={`${item.id}-${index}`}
              className='group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-md motion-reduce:transition-none motion-reduce:hover:transform-none'
            >
              <Link
                href={href}
                className='flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded-2xl'
              >
                <div className='relative aspect-square w-full overflow-hidden bg-muted/20'>
                  <SmartImage
                    src={productImageSrc(item.primaryImageUrl)}
                    alt={formatEmpty(title)}
                    fill
                    priority={index === 0}
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
                    {item.brandName ? (
                      <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate'>
                        {item.brandName}
                      </p>
                    ) : null}
                  </div>

                  <h3 className='text-xs sm:text-sm font-semibold leading-snug text-foreground line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem] transition-colors duration-200 [@media(hover:hover)]:group-hover:text-emerald-600 dark:[@media(hover:hover)]:group-hover:text-emerald-400'>
                    {title}
                  </h3>

                  <div className='flex items-center gap-1 text-[11px] text-muted-foreground pt-1.5 pb-2.5 truncate'>
                    <Icons.store className='h-3 w-3 shrink-0 text-muted-foreground/70' />
                    <span className='truncate'>
                      {item.shop.displayName}
                      {item.shop.city ? ` · ${item.shop.city}` : ''}
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
