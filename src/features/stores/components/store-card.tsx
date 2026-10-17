import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/media/smart-image';
import { shopLogoSrc } from '@/constants/placeholders';
import { buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import type { StoreCardProps } from '@/types/store';

export async function StoreCard({ store, priority = false }: StoreCardProps) {
  const t = await getTranslations();

  const name = store.displayName || store.name || t('common.appName');
  const phone = store.phone || store.phoneNumber || store.whatsappNumber || '';
  const whatsappHref = phone
    ? buildWhatsAppLink(phone, t('whatsapp.foundShop', { storeName: name }))
    : undefined;

  const productCount = store.productCount ?? store.totalProducts ?? 0;
  const blurb = store.description || store.about;
  const banner = store.heroBannerUrl || store.bannerUrl;

  return (
    <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_0_oklch(0_0_0/_0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_40px_-28px_oklch(0.4_0.1_152/_0.55)]'>
      <div className='relative h-36 w-full overflow-hidden'>
        {banner ? (
          <SmartImage
            src={banner}
            alt=''
            fill
            priority={priority}
            className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            sizes='(max-width: 768px) 100vw, 25vw'
          />
        ) : (
          <div className='absolute inset-0 bg-[linear-gradient(135deg,_oklch(0.72_0.12_152/_0.35),_oklch(0.78_0.08_220/_0.2)_45%,_oklch(0.95_0.02_152)_100%)] dark:bg-[linear-gradient(135deg,_oklch(0.35_0.08_152/_0.55),_oklch(0.25_0.04_250)_100%)]' />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent' />

        <div className='absolute bottom-3 start-3 end-3 flex items-end gap-3'>
          <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-background shadow-md'>
            <SmartImage
              src={shopLogoSrc(store.logoUrl)}
              alt={formatEmpty(name)}
              fill
              priority={priority}
              className='object-cover'
              sizes='56px'
            />
          </div>
          <div className='min-w-0 pb-0.5'>
            <div className='flex items-center gap-1.5'>
              <h3 className='truncate text-lg font-bold tracking-tight text-foreground'>
                {formatEmpty(name)}
              </h3>
              <Icons.badgeCheck className='h-4 w-4 shrink-0 text-primary' />
            </div>
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <Icons.mapPin className='h-3 w-3 shrink-0' />
              <span className='truncate'>{formatEmpty(store.city)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-3 p-4'>
        <p className='line-clamp-1 text-xs text-muted-foreground'>{formatEmpty(store.address)}</p>
        {blurb ? (
          <p className='line-clamp-2 text-sm leading-relaxed text-foreground/85'>{blurb}</p>
        ) : null}

        <Badge variant='success' className='w-fit gap-1 text-[11px]'>
          <Icons.mobile className='h-3 w-3' />
          {t('stores.productsAvailable', { count: productCount })}
        </Badge>

        <div className='mt-auto grid grid-cols-2 gap-2 pt-1'>
          {whatsappHref ? (
            <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='w-full'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-full gap-1.5 border-emerald-500/30 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
              >
                <Icons.whatsapp className='h-3.5 w-3.5' />
                {t('stores.whatsapp')}
              </Button>
            </a>
          ) : (
            <Button type='button' variant='outline' size='sm' className='w-full gap-1.5 text-xs' disabled>
              <Icons.whatsapp className='h-3.5 w-3.5' />
              {t('stores.whatsapp')}
            </Button>
          )}

          <Link href={`/shop/${store.slug}`} className='w-full'>
            <Button type='button' size='sm' className='w-full gap-1.5 text-xs shadow-sm'>
              {t('stores.viewShop')}
              <Icons.arrowRight className='h-3.5 w-3.5' />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
