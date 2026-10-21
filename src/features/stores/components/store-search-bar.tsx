'use client';

import type { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { StoreSearchBarProps } from '@/types/store';

export function StoreSearchBar({ searchQuery, onSearchChange }: StoreSearchBarProps) {
  const t = useTranslations();

  const clearSearch = () => {
    onSearchChange('');
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className='relative mx-auto flex w-full max-w-xl items-center overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
      <Icons.search className='pointer-events-none absolute inset-s-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:inset-s-4 sm:h-5 sm:w-5' />
      <Input
        type='search'
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={t('hero.searchPlaceholder')}
        className='h-11 w-full rounded-none border-0 bg-transparent ps-10 pe-11 text-sm shadow-none outline-none ring-0 ring-offset-0 appearance-none focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-12 sm:ps-12 sm:text-base [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
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
  );
}
