'use client';

import type { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { StoreHeroProps } from '@/types/store';

export function StoreHero({ searchQuery, onSearchChange }: StoreHeroProps) {
  const t = useTranslations();

  const clearSearch = () => {
    onSearchChange('');
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const scrollToShops = () => {
    document.getElementById('verified-shops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative isolate min-h-[72vh] overflow-hidden border-b border-border/50'>
      <div className='hero-atmosphere absolute inset-0' />
      <div className='hero-grid absolute inset-0 opacity-[0.04] dark:opacity-[0.07]' />

      <div className='relative mx-auto flex min-h-[72vh] max-w-[1600px] flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8'>
        <div className='mx-auto w-full max-w-3xl text-center'>
          <p className='animate-in fade-in slide-in-from-bottom-2 mb-4 text-sm font-semibold tracking-[0.18em] text-primary uppercase duration-700'>
            {t('common.appName')}
          </p>

          <h1 className='animate-in fade-in slide-in-from-bottom-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl duration-700 delay-75'>
            {t('hero.title')}
          </h1>

          <p className='animate-in fade-in slide-in-from-bottom-3 mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed duration-700 delay-150'>
            {t('hero.subtitle')}
          </p>

          <div className='animate-in fade-in slide-in-from-bottom-4 mx-auto mt-8 max-w-2xl duration-700 delay-200'>
            <div className='relative flex items-center rounded-2xl border border-border/80 bg-card/90 shadow-[0_20px_50px_-24px_oklch(0.4_0.08_152/_0.45)] backdrop-blur-md'>
              <Icons.search className='pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='search'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('hero.searchPlaceholder')}
                className='h-14 w-full rounded-2xl border-0 bg-transparent ps-12 pe-12 text-base shadow-none focus-visible:ring-0'
              />
              {searchQuery ? (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={clearSearch}
                  className='absolute end-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full p-0'
                  aria-label={t('aria.clearSearch')}
                >
                  <Icons.close className='h-4 w-4' />
                </Button>
              ) : null}
            </div>

            <div className='mt-5 flex flex-wrap items-center justify-center gap-2'>
              <Button type='button' onClick={scrollToShops} className='gap-2 shadow-sm'>
                {t('hero.ctaExplore')}
                <Icons.arrowRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <ul className='animate-in fade-in mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground duration-1000 delay-300'>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.check className='h-4 w-4 text-primary' />
              {t('hero.trustLive')}
            </li>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.shieldCheck className='h-4 w-4 text-primary' />
              {t('hero.trustPta')}
            </li>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.whatsapp className='h-4 w-4 text-primary' />
              {t('hero.trustWhatsapp')}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
