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
          <div className='relative flex items-center shadow-lg rounded-2xl bg-card border border-border p-1.5 focus-within:ring-2 focus-within:ring-primary'>
            <Icons.search className='ms-3 h-5 w-5 text-muted-foreground shrink-0' />
            <Input
              type='text'
              value={initialSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className='border-0 bg-transparent shadow-none focus-visible:ring-0 text-base h-11'
            />
            {initialSearch ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => onSearchChange('')}
                className='h-8 w-8 p-0 text-muted-foreground me-1'
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
