import { getTranslations } from 'next-intl/server';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import {
  buildWhatsAppLink,
  formatEmpty,
  formatPhone,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import { formatOpeningHoursDisplay } from '@/lib/opening-hours';
import { hasStoreCoords } from '@/lib/geo';
import { cn } from '@/lib/utils';
import type { StoreHeaderProps } from '@/types/store';
import { StoreMapLink } from './store-map-link';

export async function StoreHeader({ store }: StoreHeaderProps) {
  const t = await getTranslations();

  const name = store.displayName || store.name || t('common.appName');
  const phoneNumber = store.phoneNumber?.trim() || '';
  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : undefined;
  const whatsappNumber = resolveStoreWhatsAppNumber(store);
  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, t('whatsapp.contactShop', { storeName: name }))
    : undefined;

  const location = store.address
    ? `${store.address}${store.city ? `, ${store.city}` : ''}`
    : formatEmpty(store.city);
  const banner = store.heroBannerUrl || store.bannerUrl;
  const about = store.description || store.about;
  const hours = formatOpeningHoursDisplay(store.openingHours);

  return (
    <header className='border-b border-border/60 bg-background'>
      <div className='relative h-36 w-full overflow-hidden sm:h-44 md:h-52'>
        {banner ? (
          <PreviewableImage
            src={banner}
            alt={t('stores.bannerAlt', { store: formatEmpty(name) })}
            priority
            className='absolute inset-0 h-full w-full'
            imageClassName='object-cover'
            sizes='100vw'
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-muted' />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent' />
      </div>

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8'>
        <div className='relative -mt-12 flex flex-col gap-5 pb-6 sm:-mt-14 sm:pb-8 md:flex-row md:items-end md:justify-between md:gap-8'>
          <div className='flex min-w-0 items-start gap-3.5 sm:gap-4'>
            <PreviewableImage
              src={store.logoUrl}
              alt={formatEmpty(name)}
              priority
              className='h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-md sm:h-24 sm:w-24'
              imageClassName='object-cover'
              sizes='96px'
              fallbackSrc={PLACEHOLDER_SHOP_LOGO}
            />

            <div className='min-w-0 space-y-1.5 pt-1 sm:pt-2'>
              <h1 className='truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl'>
                {formatEmpty(store.displayName || store.name)}
              </h1>

              <div className='flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 sm:text-sm'>
                <span className='inline-flex min-w-0 items-center gap-1.5'>
                  <Icons.mapPin className='h-3.5 w-3.5 shrink-0 text-primary' />
                  <span className='truncate'>{location}</span>
                </span>
                {hours ? (
                  <span className='inline-flex items-center gap-1.5'>
                    <Icons.clock className='h-3.5 w-3.5 shrink-0' />
                    <span>{hours}</span>
                  </span>
                ) : null}
              </div>

              {about ? (
                <p className='max-w-2xl line-clamp-2 pt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm'>
                  {about}
                </p>
              ) : null}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2 md:shrink-0'>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  buttonVariants(),
                  'gap-2 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                )}
              >
                <Icons.whatsapp className='h-4 w-4' />
                {t('stores.whatsapp')}
              </a>
            ) : null}

            {phoneHref ? (
              <a
                href={phoneHref}
                className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
              >
                <Icons.phone className='h-4 w-4' />
                <span dir='ltr'>{formatPhone(store.phoneNumber)}</span>
              </a>
            ) : (
              <Button type='button' variant='outline' className='gap-2' disabled>
                <Icons.phone className='h-4 w-4' />
                <span>{formatEmpty(null)}</span>
              </Button>
            )}

            {hasStoreCoords(store) ? (
              <StoreMapLink store={store} triggerClassName='gap-2' />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
