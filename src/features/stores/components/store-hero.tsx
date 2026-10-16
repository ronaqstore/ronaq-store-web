'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { StoreHeroProps } from '@/types/store';

export function StoreHero({
  initialSearch = '',
  onSearchChange
}: StoreHeroProps) {
  const t = useTranslations();

  return (
    <div className='relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60 bg-gradient-to-b from-background via-muted/20 to-background'>
      <div className='absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none' />

      <div className='relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6'>
        <h1 className='text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground'>
          {t('hero.title')}
        </h1>

        <p className='mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed'>
          {t('hero.subtitle')}
        </p>

        <div className='mx-auto max-w-3xl pt-4'>
          <div className='relative flex items-center'>
            <Icons.search className='pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <Input
              type='text'
              value={initialSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className='h-13 w-full rounded-2xl bg-card border-border shadow-lg ps-12 pe-12 text-base text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all'
            />
            {initialSearch ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => onSearchChange('')}
                className='absolute end-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full'
                aria-label={t('aria.clearSearch')}
              >
                <Icons.close className='h-4 w-4' />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
