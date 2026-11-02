'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import { formatEmpty } from '@/lib/formatters';
import type { SellerCardProps } from '@/types/product';

export function SellerCard({ store, slug }: SellerCardProps) {
  const t = useTranslations('catalog');
  const storeName = formatEmpty(store.displayName || store.name);
  const location = [store.address, store.city].filter(Boolean).join(', ') || store.city;

  return (
    <div className='rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-4 transition-all duration-200 hover:border-emerald-600/30 hover:bg-muted/30'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-3 min-w-0 flex-1'>
          <div className='relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs'>
            {store.logoUrl ? (
              <SmartImage
                src={store.logoUrl}
                alt={storeName}
                fill
                className='object-cover'
                sizes='48px'
                fallbackSrc={PLACEHOLDER_SHOP_LOGO}
              />
            ) : (
              <Icons.store className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-1.5'>
              <span className='font-bold text-sm sm:text-base text-foreground break-words line-clamp-1'>
                {storeName}
              </span>
              <Icons.circleCheck className='h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400' aria-hidden />
            </div>

            {location ? (
              <div className='flex items-center gap-1 text-xs text-muted-foreground mt-0.5'>
                <Icons.mapPin className='h-3.5 w-3.5 shrink-0 opacity-70' />
                <span className='truncate'>{location}</span>
              </div>
            ) : null}
          </div>
        </div>

        <Link
          href={`/shop/${slug}`}
          className='inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-xl sm:rounded-lg border border-border/70 bg-card px-3.5 py-2 sm:py-1.5 text-xs font-semibold text-foreground shadow-xs transition-all hover:border-emerald-600/40 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 active:scale-[0.98]'
        >
          <span>{t('visitShop')}</span>
          <Icons.chevronRight className='h-3.5 w-3.5 rtl:rotate-180' />
        </Link>
      </div>
    </div>
  );
}
