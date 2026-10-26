'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import {
  buildWhatsAppLink,
  formatEmpty,
  formatPhone,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import { buildTelUrl, normalizePakistaniMobile } from '@/lib/contact-links';
import { formatHours } from '@/lib/shop-hours';
import { hasStoreCoords } from '@/lib/geo';
import { cn } from '@/lib/utils';
import type { StoreCardProps } from '@/types/store';
import { StoreMapLink } from './store-map-link';

export function StoreCard({ store, priority = false }: StoreCardProps) {
  const t = useTranslations();

  const name = store.displayName || store.name || t('common.appName');
  const phone = resolveStoreWhatsAppNumber(store);
  const displayPhone = store.phoneNumber || store.phone || null;
  const callHref =
    displayPhone && normalizePakistaniMobile(displayPhone)
      ? buildTelUrl(displayPhone)
      : '#';
  const whatsappHref = phone
    ? buildWhatsAppLink(phone, t('whatsapp.foundShop', { storeName: name }))
    : undefined;

  const productCount = store.productCount ?? store.totalProducts ?? 0;
  const blurb = store.description || store.about;
  const banner = store.heroBannerUrl || store.bannerUrl;
  const hours = formatHours(store.openingHours);
  const shopHref = `/shop/${store.slug}`;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card',
        'transition-colors duration-200 hover:border-primary/40 hover:shadow-md'
      )}
    >
      <Link
        href={shopHref}
        className='absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        aria-label={name}
      />

      <div className='pointer-events-none relative h-32 w-full overflow-hidden sm:h-36'>
        {banner ? (
          <SmartImage
            src={banner}
            alt=''
            fill
            priority={priority}
            className='object-cover transition-transform duration-500 group-hover:scale-[1.02]'
            sizes='(max-width: 768px) 100vw, 25vw'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted' />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent' />

        <div className='absolute bottom-3 inset-s-3 inset-e-3 flex items-end gap-3'>
          <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm sm:h-14 sm:w-14 sm:rounded-full'>
            <SmartImage
              src={store.logoUrl || PLACEHOLDER_SHOP_LOGO}
              alt={formatEmpty(name)}
              fill
              priority={priority}
              className='object-cover'
              sizes='56px'
              fallbackSrc={PLACEHOLDER_SHOP_LOGO}
            />
          </div>
          <div className='min-w-0 pb-0.5'>
            <h3 className='truncate text-base font-bold tracking-tight text-foreground sm:text-lg'>
              {formatEmpty(name)}
            </h3>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Icons.mapPin className='h-3 w-3 shrink-0' />
              <span className='truncate'>{formatEmpty(store.city)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className='pointer-events-none relative flex flex-1 flex-col gap-2.5 p-4'>
        <div className='space-y-1.5 text-xs text-muted-foreground sm:text-[13px]'>
          {store.address ? (
            <p className='flex items-start gap-1.5'>
              <Icons.mapPin className='mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span className='line-clamp-2 leading-relaxed'>{store.address}</span>
            </p>
          ) : null}

          {hours ? (
            <p className='flex items-center gap-1.5'>
              <Icons.clock className='h-3.5 w-3.5 shrink-0' />
              <span className='truncate'>
                {t('stores.timing')}: {hours}
              </span>
            </p>
          ) : null}

          {displayPhone ? (
            <a
              href={callHref}
              className='pointer-events-auto relative z-20 flex items-center gap-1.5 hover:text-foreground'
              aria-label={t('stores.call')}
            >
              <Icons.phone className='h-3.5 w-3.5 shrink-0' />
              <span className='truncate' dir='ltr'>
                {formatPhone(displayPhone)}
              </span>
            </a>
          ) : null}
        </div>

        {blurb ? (
          <p className='line-clamp-2 text-sm leading-relaxed text-foreground/85'>{blurb}</p>
        ) : null}

        <div className='mt-auto flex flex-wrap items-center justify-between gap-2 pt-1'>
          <Badge variant='secondary' className='w-fit gap-1 text-[11px] font-medium'>
            <Icons.mobile className='h-3 w-3' />
            {t('stores.productsAvailable', { count: productCount })}
          </Badge>

          <div className='pointer-events-auto relative z-20 flex flex-wrap items-center gap-1.5'>
            {hasStoreCoords(store) ? (
              <StoreMapLink
                store={store}
                triggerClassName='cursor-pointer border-primary/25 text-primary hover:bg-primary/10'
              />
            ) : null}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'cursor-pointer gap-1.5 border-emerald-500/30 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
                )}
                aria-label={t('stores.whatsapp')}
              >
                <Icons.whatsapp className='h-3.5 w-3.5' />
                {t('stores.whatsapp')}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
