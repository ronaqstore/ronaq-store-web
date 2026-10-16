import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildWhatsAppLink, formatPhone } from '@/lib/formatters';
import type { StoreHeaderProps } from '@/types/store';

export function StoreHeader({ store }: StoreHeaderProps) {
  const t = useTranslations();

  const name = store.displayName || store.name || 'Shop';
  const phoneNumber = store.phoneNumber || store.whatsappNumber || '';
  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : '#';
  const whatsappNumber = store.whatsappNumber || store.phoneNumber || '';
  const whatsappHref = whatsappNumber
    ? buildWhatsAppLink(
        whatsappNumber,
        `Hello ${name}, I am contacting you from your DukanPro store page.`
      )
    : '#';

  return (
    <div className='relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-muted/30 via-background to-background'>
      <div className='h-40 sm:h-52 w-full bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-sky-600/30 relative flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-radial-gradient from-transparent to-background/90' />
      </div>

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8'>
        <div className='relative -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-end gap-4'>
            <div className='flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-card border-4 border-background shadow-xl text-primary font-black text-3xl sm:text-4xl shrink-0'>
              {(name || 'S').slice(0, 1).toUpperCase()}
            </div>

            <div className='space-y-1.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <h1 className='text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight'>
                  {store.displayName}
                </h1>
                <Badge variant='success' className='gap-1 text-xs'>
                  <Icons.badgeCheck className='h-3.5 w-3.5' />
                  {t('common.verified')}
                </Badge>
              </div>

              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Icons.mapPin className='h-3.5 w-3.5 text-primary' />
                  {store.address ? `${store.address}, ${store.city}` : store.city}
                </span>

                {store.openingHours ? (
                  <span className='flex items-center gap-1'>
                    <Icons.clock className='h-3.5 w-3.5' />
                    {store.openingHours}
                  </span>
                ) : null}
              </div>

              {store.description ? (
                <p className='text-xs sm:text-sm text-foreground/80 max-w-2xl pt-1 leading-relaxed'>
                  {store.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2.5 pt-2 md:pt-0'>
            <a
              href={whatsappHref}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button type='button' className='gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'>
                <Icons.whatsapp className='h-4 w-4' />
                {t('stores.whatsapp')}
              </Button>
            </a>

            <a href={phoneHref}>
              <Button type='button' variant='outline' className='gap-2'>
                <Icons.phone className='h-4 w-4' />
                <span>{formatPhone(store.phoneNumber)}</span>
              </Button>
            </a>

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
