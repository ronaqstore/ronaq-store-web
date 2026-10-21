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
    document.getElementById('shops')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className='relative isolate overflow-hidden border-b border-border/50'>
      <div className='hero-atmosphere absolute inset-0' />
      <div className='hero-grid absolute inset-0 opacity-[0.035] dark:opacity-[0.06]' />

      <div className='relative mx-auto flex max-w-[1600px] flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20'>
        <div className='mx-auto w-full max-w-2xl text-center'>
          <p className='mb-3 text-xs font-semibold tracking-[0.16em] text-primary uppercase sm:text-sm'>
            {t('common.appName')}
          </p>

          <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl'>
            {t('hero.title')}
          </h1>

          <p className='mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base'>
            {t('hero.subtitle')}
          </p>

          <div className='mx-auto mt-7 max-w-xl sm:mt-8'>
            <div className='relative flex items-center overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
              <Icons.search className='pointer-events-none absolute inset-s-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:inset-s-4 sm:h-5 sm:w-5' />
              <Input
                type='search'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('hero.searchPlaceholder')}
                className='h-12 w-full rounded-none border-0 bg-transparent ps-10 pe-11 text-sm shadow-none outline-none ring-0 ring-offset-0 appearance-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-14 sm:ps-12 sm:text-base [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
              />
              {searchQuery ? (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={clearSearch}
                  className='absolute inset-e-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full p-0'
                  aria-label={t('aria.clearSearch')}
                >
                  <Icons.close className='h-4 w-4' />
                </Button>
              ) : null}
            </div>

            <div className='mt-4 flex flex-wrap items-center justify-center gap-2'>
              <Button type='button' onClick={scrollToShops} className='gap-2 shadow-sm'>
                {t('hero.ctaExplore')}
                <Icons.arrowRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <ul className='mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm'>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.check className='h-3.5 w-3.5 text-primary sm:h-4 sm:w-4' />
              {t('hero.trustLive')}
            </li>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.shieldCheck className='h-3.5 w-3.5 text-primary sm:h-4 sm:w-4' />
              {t('hero.trustPta')}
            </li>
            <li className='inline-flex items-center gap-1.5'>
              <Icons.whatsapp className='h-3.5 w-3.5 text-primary sm:h-4 sm:w-4' />
              {t('hero.trustWhatsapp')}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
