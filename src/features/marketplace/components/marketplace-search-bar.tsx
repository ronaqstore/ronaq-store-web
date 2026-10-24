'use client';

import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { searchMarketplaceModels } from '@/features/marketplace/api/service';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import {
  MARKETPLACE_SEARCH_MAX_LEN,
  sanitizeMarketplaceText
} from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type {
  MarketplaceModelSuggestion,
  MarketplaceSearchBarProps
} from '@/types/marketplace';

export function MarketplaceSearchBar({
  searchQuery,
  onSearchChange,
  cityId,
  modelKey,
  onSelectModel,
  onSearchAll,
  onClearModel
}: MarketplaceSearchBarProps) {
  const t = useTranslations();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MarketplaceModelSuggestion[]>([]);
  const [totalGroups, setTotalGroups] = useState(0);
  const debouncedQuery = useDebouncedValue(
    sanitizeMarketplaceText(searchQuery),
    300
  );
  const activeModel = Boolean(modelKey);

  useEffect(() => {
    if (activeModel || debouncedQuery.length < 2) {
      setSuggestions([]);
      setTotalGroups(0);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void searchMarketplaceModels({ q: debouncedQuery, city: cityId, limit: 8 }).then(
      (result) => {
        if (cancelled) return;
        setSuggestions(result.items);
        setTotalGroups(result.total);
        setLoading(false);
        setOpen(true);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [activeModel, cityId, debouncedQuery]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const clearSearch = () => {
    onSearchChange('');
    onClearModel();
    setSuggestions([]);
    setOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    if (modelKey) onClearModel();
    setOpen(true);
  };

  const handleSelect = (item: MarketplaceModelSuggestion) => {
    onSelectModel(item);
    setOpen(false);
  };

  const handleSearchAll = () => {
    onSearchAll(searchQuery.trim());
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchAll();
    }
  };

  const showDropdown = open && !activeModel && searchQuery.trim().length >= 2;

  return (
    <div ref={rootRef} className='relative mx-auto w-full max-w-xl'>
      <div className='relative flex w-full items-center overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
        <Icons.search className='pointer-events-none absolute inset-s-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:inset-s-4 sm:h-5 sm:w-5' />
        <Input
          type='search'
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (sanitizeMarketplaceText(searchQuery).length >= 2 && !activeModel) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={t('marketplace.searchPlaceholder')}
          role='combobox'
          aria-expanded={showDropdown}
          aria-controls={listId}
          autoComplete='off'
          maxLength={MARKETPLACE_SEARCH_MAX_LEN}
          spellCheck={false}
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

      {showDropdown ? (
        <div
          id={listId}
          role='listbox'
          className='absolute inset-x-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-border bg-card shadow-xl'
        >
          <div className='flex items-center gap-2 border-b border-border/70 px-3.5 py-2.5'>
            <Icons.tag className='h-4 w-4 text-primary' />
            <p className='text-sm font-semibold text-foreground'>
              {t('marketplace.searchModelsHeading')}
            </p>
            <span className='ms-auto rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary'>
              {totalGroups || suggestions.length}
            </span>
          </div>

          <ul className='max-h-80 overflow-y-auto py-1.5'>
            {loading && suggestions.length === 0 ? (
              <li className='px-4 py-6 text-center text-sm text-muted-foreground'>
                {t('common.loading')}
              </li>
            ) : null}
            {!loading && suggestions.length === 0 ? (
              <li className='px-4 py-6 text-center text-sm text-muted-foreground'>
                {t('marketplace.noProductsFound')}
              </li>
            ) : null}
            {suggestions.map((item) => (
              <li key={item.modelKey}>
                <button
                  type='button'
                  role='option'
                  className={cn(
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-start transition-colors',
                    'hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none'
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <span className='relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-muted/40'>
                    <Image
                      src={item.imageUrl || PLACEHOLDER_PRODUCT_IMAGE}
                      alt=''
                      fill
                      unoptimized
                      className='object-contain p-1'
                      sizes='44px'
                    />
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block truncate text-sm font-semibold text-foreground'>
                      {item.title}
                    </span>
                    <span className='mt-0.5 block text-xs text-muted-foreground'>
                      {t('marketplace.modelListingCount', { count: item.count })}
                    </span>
                  </span>
                  <Icons.chevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
                </button>
              </li>
            ))}
          </ul>

          <button
            type='button'
            className='flex w-full items-center justify-center border-t border-border/70 px-3.5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/60'
            onClick={handleSearchAll}
          >
            {t('marketplace.searchAll')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
