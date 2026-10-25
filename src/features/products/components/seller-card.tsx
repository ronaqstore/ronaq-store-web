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
    <div className='rounded-2xl border border-border/80 bg-muted/20 p-4 transition-all duration-200 hover:border-emerald-600/30 hover:bg-muted/30'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs'>
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

          <div className='min-w-0'>
            <div className='flex items-center gap-1.5'>
              <span className='truncate text-sm font-bold text-foreground'>
                {storeName}
              </span>
              <Icons.circleCheck className='h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400' aria-hidden />
            </div>

            {location ? (
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <Icons.mapPin className='h-3.5 w-3.5 shrink-0 opacity-70' />
                <span className='truncate'>{location}</span>
              </div>
            ) : null}
          </div>
        </div>

        <Link
          href={`/shop/${slug}`}
          className='inline-flex shrink-0 items-center gap-1 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-all hover:border-emerald-600/40 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300'
        >
          <span>{t('visitShop')}</span>
          <Icons.chevronRight className='h-3.5 w-3.5 rtl:rotate-180' />
        </Link>
      </div>
    </div>
  );
}
