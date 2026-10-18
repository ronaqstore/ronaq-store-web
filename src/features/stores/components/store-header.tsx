import { getTranslations } from 'next-intl/server';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_SHOP_LOGO } from '@/constants/placeholders';
import {
  buildWhatsAppLink,
  formatEmpty,
  formatPhone,
  resolveStoreWhatsAppNumber
} from '@/lib/formatters';
import type { StoreHeaderProps } from '@/types/store';

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

  return (
    <div className='relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-muted/30 via-background to-background'>
      <div className='relative flex h-40 w-full items-center justify-center overflow-hidden sm:h-52'>
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
          <div className='absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-sky-600/30' />
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent' />
      </div>

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8'>
        <div className='relative -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-end gap-4'>
            <PreviewableImage
              src={store.logoUrl}
              alt={formatEmpty(name)}
              priority
              className='h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-xl sm:h-32 sm:w-32'
              imageClassName='object-cover'
              sizes='128px'
              fallbackSrc={PLACEHOLDER_SHOP_LOGO}
            />

            <div className='space-y-1.5'>
              <h1 className='text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight'>
                {formatEmpty(store.displayName || store.name)}
              </h1>

              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Icons.mapPin className='h-3.5 w-3.5 text-primary' />
                  {location}
                </span>

                <span className='flex items-center gap-1'>
                  <Icons.clock className='h-3.5 w-3.5' />
                  {formatEmpty(store.openingHours)}
                </span>
              </div>

              <p className='max-w-2xl pt-1 text-xs leading-relaxed text-foreground/80 sm:text-sm'>
                {formatEmpty(about)}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2.5 pt-2 md:pt-0'>
            {whatsappHref ? (
              <a href={whatsappHref} target='_blank' rel='noopener noreferrer'>
                <Button type='button' className='gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'>
                  <Icons.whatsapp className='h-4 w-4' />
                  {t('stores.whatsapp')}
                </Button>
              </a>
            ) : null}

            {phoneHref ? (
              <a href={phoneHref}>
                <Button type='button' variant='outline' className='gap-2'>
                  <Icons.phone className='h-4 w-4' />
                  <span>{formatPhone(store.phoneNumber)}</span>
                </Button>
              </a>
            ) : (
              <Button type='button' variant='outline' className='gap-2' disabled>
                <Icons.phone className='h-4 w-4' />
                <span>{formatEmpty(null)}</span>
              </Button>
            )}

            {store.googleMapsUrl ? (
              <a
                href={store.googleMapsUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button type='button' variant='ghost' size='icon' aria-label={t('aria.directions')}>
                  <Icons.externalLink className='h-4 w-4' />
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
