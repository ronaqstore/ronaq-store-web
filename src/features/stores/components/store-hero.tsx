'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';

export function StoreHero() {
  const t = useTranslations();

  return (
    <section className='border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-background py-6 sm:py-8 md:py-10 lg:py-12'>
      <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8'>
        <p className='mb-2 text-[11px] font-semibold tracking-wide text-primary uppercase'>
          {t('common.appName')}
        </p>
        <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl 2xl:text-5xl'>
          {t('hero.title')}
        </h1>
        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-sm md:text-base lg:text-base 2xl:text-lg'>
          {t('hero.subtitle')}
        </p>

        <ul className='mt-4 hidden flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground md:flex md:text-sm'>
          <li className='inline-flex items-center gap-1.5'>
            <Icons.check className='h-3.5 w-3.5 text-primary' />
            {t('hero.trustLive')}
          </li>
          <li className='inline-flex items-center gap-1.5'>
            <Icons.shieldCheck className='h-3.5 w-3.5 text-primary' />
            {t('hero.trustPta')}
          </li>
          <li className='inline-flex items-center gap-1.5'>
            <Icons.whatsapp className='h-3.5 w-3.5 text-primary' />
            {t('hero.trustWhatsapp')}
          </li>
        </ul>
      </div>
    </section>
  );
}
