'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { SmartImage } from '@/components/media/smart-image';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import {
  buildWhatsAppLink,
  formatEmpty,
  formatNumber,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import { buildTelUrl, normalizePakistaniMobile } from '@/lib/contact-links';
import { formatHours, getOpenStatus } from '@/lib/shop-hours';
import { buildGoogleMapsUrl, hasStoreCoords } from '@/lib/geo';
import { cn } from '@/lib/utils';
import type { StoreCardProps } from '@/types/store';

function locationLine(address: string | null | undefined, city: string): string {
  const cityLabel = city.trim();
  const addr = address?.trim() ?? '';
  if (!addr) return cityLabel;
  if (cityLabel && addr.toLowerCase().includes(cityLabel.toLowerCase())) return addr;
  return cityLabel ? `${addr}, ${cityLabel}` : addr;
}

function shopInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'R';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function StoreCard({ store, priority = false }: StoreCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const name = store.displayName || store.name || t('common.appName');
  const phone = resolveStoreWhatsAppNumber(store);
  const displayPhone = store.phoneNumber || store.phone || null;
  const callHref =
    displayPhone && normalizePakistaniMobile(displayPhone)
      ? buildTelUrl(displayPhone)
      : null;
  const whatsappHref = phone
    ? buildWhatsAppLink(phone, t('whatsapp.foundShop', { storeName: name }))
    : null;
  const mapsHref = hasStoreCoords(store)
    ? buildGoogleMapsUrl(Number(store.latitude), Number(store.longitude))
    : null;

  const productCount = store.productCount ?? store.totalProducts ?? 0;
  const rawBlurb = (store.description || store.about || '').trim();
  const blurb =
    rawBlurb && rawBlurb.toLowerCase() !== name.trim().toLowerCase() ? rawBlurb : null;
  const banner = store.heroBannerUrl || store.bannerUrl;
  const hoursLabel = formatHours(store.openingHours, locale);
  const openStatus = getOpenStatus(store.openingHours);
  const place = locationLine(store.address, store.city);
  const shopHref = `/shop/${store.slug}`;
  const initials = shopInitials(name);

  const statusLabel =
    openStatus.status === 'open' && openStatus.closesAt
      ? t('stores.openClosesAt', { time: openStatus.closesAt })
      : openStatus.status === 'closed' && openStatus.opensAt
        ? t('stores.closedOpensAt', { time: openStatus.opensAt })
        : null;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card',
        'transition-all duration-200 motion-reduce:transition-none',
        '[@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-md',
        'motion-reduce:hover:transform-none'
      )}
    >
      <Link
        href={shopHref}
        className='absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
        aria-label={name}
      />

      <div className='pointer-events-none relative aspect-[16/7] w-full overflow-hidden bg-muted'>
        {banner ? (
          <SmartImage
            src={banner}
            alt=''
            fill
            priority={priority}
            className='object-cover transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none'
            sizes='(max-width:639px) 100vw, (max-width:1023px) 50vw, 25vw'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-primary/15 to-muted' />
        )}
        <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/90 to-transparent' />
      </div>

      <div className='pointer-events-none relative z-[1] -mt-6 flex flex-1 flex-col px-3 pb-3 md:px-4 md:pb-4'>
        <div className='mb-2 flex items-end gap-3'>
          <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-background bg-muted shadow-sm ring-2 ring-background md:h-14 md:w-14'>
            {store.logoUrl ? (
              <SmartImage
                src={store.logoUrl}
                alt={formatEmpty(name)}
                fill
                priority={priority}
                className='object-cover'
                sizes='56px'
                fallbackSrc={PLACEHOLDER_SHOP_LOGO}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 text-sm font-bold text-white'>
                {initials}
              </div>
            )}
          </div>
        </div>

        <h3 className='truncate text-base font-bold tracking-tight text-foreground md:text-lg'>
          {formatEmpty(name)}
        </h3>

        <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm'>
          <Icons.mapPin className='h-3.5 w-3.5 shrink-0' />
          <span className='truncate'>{formatEmpty(place)}</span>
        </p>

        {statusLabel ? (
          <p
            className={cn(
              'mt-2 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold md:text-xs',
              openStatus.status === 'open'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {statusLabel}
          </p>
        ) : hoursLabel ? (
          <p className='mt-2 text-xs text-muted-foreground md:text-sm'>
            {t('stores.timing')}: {hoursLabel}
          </p>
        ) : null}

        <p className='mt-2 text-xs text-muted-foreground md:text-sm'>
          {t('stores.productsAvailable', { count: formatNumber(productCount, locale) })}
        </p>

        {blurb ? (
          <p className='mt-2 hidden text-sm leading-relaxed text-muted-foreground line-clamp-2 min-[640px]:block'>
            {blurb}
          </p>
        ) : null}

        <div className='pointer-events-auto relative z-20 mt-auto flex min-h-11 items-center gap-2 pt-3'>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ variant: 'default' }),
                'h-11 min-h-11 flex-1 gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700'
              )}
              aria-label={t('stores.whatsapp')}
            >
              <Icons.whatsapp className='h-4 w-4' />
              {t('stores.whatsapp')}
            </a>
          ) : (
            <div className='h-11 flex-1' />
          )}
          {callHref ? (
            <a
              href={callHref}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'h-11 w-11 min-h-11 min-w-11 rounded-xl'
              )}
              aria-label={t('stores.call')}
            >
              <Icons.phone className='h-4 w-4' />
            </a>
          ) : null}
          {mapsHref ? (
            <a
              href={mapsHref}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'h-11 w-11 min-h-11 min-w-11 rounded-xl'
              )}
              aria-label={t('stores.mapAction')}
            >
              <Icons.mapPin className='h-4 w-4' />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
