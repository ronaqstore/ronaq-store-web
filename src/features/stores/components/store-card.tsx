import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { shopLogoSrc } from '@/constants/placeholders';
import { buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import type { StoreCardProps } from '@/types/store';

export function StoreCard({ store }: StoreCardProps) {
  const t = useTranslations();

  const name = store.displayName || store.name || 'Shop';
  const phone = store.phone || store.phoneNumber || store.whatsappNumber || '';
  const whatsappHref = phone
    ? buildWhatsAppLink(phone, `Hello ${name}, I found your shop on Ronaq Store.`)
    : undefined;

  const productCount = store.productCount ?? store.totalProducts ?? 0;

  return (
    <Card className='group overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between'>
      <div>
        <div className='relative h-32 w-full bg-gradient-to-tr from-emerald-600/20 via-teal-500/10 to-sky-500/20 flex items-center justify-center overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-t from-background/90 to-transparent' />
          <div className='absolute bottom-3 start-4 flex items-center gap-3'>
            <div className='relative h-12 w-12 overflow-hidden rounded-xl bg-background border border-border/80 shadow-md shrink-0'>
              <Image
                src={shopLogoSrc(store.logoUrl)}
                alt={formatEmpty(name)}
                fill
                unoptimized
                className='object-cover'
                sizes='48px'
              />
            </div>
            <div>
              <div className='flex items-center gap-1.5'>
                <h3 className='font-bold text-lg text-foreground tracking-tight'>
                  {formatEmpty(name)}
                </h3>
                <Icons.badgeCheck className='h-4 w-4 text-emerald-500 shrink-0' />
              </div>
              <p className='text-xs text-muted-foreground flex items-center gap-1'>
                <Icons.mapPin className='h-3 w-3 shrink-0' />
                <span>{formatEmpty(store.city)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className='p-4 space-y-3'>
          <p className='text-xs text-muted-foreground line-clamp-1'>
            {formatEmpty(store.address)}
          </p>

          <p className='text-xs text-foreground/80 line-clamp-2 leading-relaxed'>
            {formatEmpty(store.description)}
          </p>

          <div className='flex items-center gap-2 pt-1'>
            <Badge variant='success' className='gap-1 text-[11px]'>
              <Icons.mobile className='h-3 w-3' />
              {t('stores.productsAvailable', { count: productCount })}
            </Badge>
          </div>
        </div>
      </div>

      <div className='p-4 pt-0 grid grid-cols-2 gap-2 mt-2'>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target='_blank'
            rel='noopener noreferrer'
            className='w-full'
          >
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='w-full gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:bg-emerald-500/10 border-emerald-500/30'
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
    </Card>
  );
}
