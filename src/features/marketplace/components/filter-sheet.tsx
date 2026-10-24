'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { MarketplaceFilterSidebar } from './marketplace-filter-sidebar';
import { countActiveMarketplaceFilters } from '@/lib/marketplace-filters';
import { formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { FilterSheetProps, MarketplaceListingFilters } from '@/types/marketplace';

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  totalResults
}: FilterSheetProps) {
  const t = useTranslations('marketplace');
  const tCommon = useTranslations('common');
  const [draftFilters, setDraftFilters] = useState<MarketplaceListingFilters>(filters);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const draftFilterCount = countActiveMarketplaceFilters(draftFilters);

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
    }
  }, [open, filters]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClose]);

  const handleClear = () => {
    const cleared: MarketplaceListingFilters = { sort: filters.sort };
    setDraftFilters(cleared);
    onApplyFilters(cleared);
    onOpenChange(false);
  };

  const handleApply = () => {
    onApplyFilters(draftFilters);
    onOpenChange(false);
  };

  if (!open) return null;

  const resultsSuffix =
    totalResults != null ? ` (${formatNumber(totalResults)})` : '';

  return (
    <div className='fixed inset-0 z-50 flex' role='presentation'>
      <button
        type='button'
        aria-label={tCommon('close')}
        className='absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity'
        onClick={handleClose}
      />

      <div
        ref={containerRef}
        role='dialog'
        aria-modal='true'
        aria-label={t('filtersHeading')}
        className={cn(
          'relative flex flex-col bg-background shadow-2xl transition-transform duration-300 ease-out z-10',
          'inset-x-0 bottom-0 max-h-[90dvh] w-full rounded-t-3xl border-t border-border mt-auto',
          'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
          'md:inset-y-0 md:inset-s-auto md:inset-e-0 md:h-full md:max-h-none md:w-[380px] md:rounded-none md:border-s md:border-t-0 md:pb-0'
        )}
      >
        <div className='mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/30 mt-2.5 mb-1 md:hidden' />

        <div className='flex shrink-0 items-center justify-between border-b border-border/70 px-4 py-3 sm:px-5'>
          <div className='flex items-center gap-2'>
            <Icons.filter className='h-4 w-4 text-primary' />
            <span className='text-base font-bold text-foreground'>
              {t('filtersHeading')}
            </span>
            {draftFilterCount > 0 ? (
              <span className='rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary'>
                {draftFilterCount}
              </span>
            ) : null}
          </div>

          <div className='flex items-center gap-2'>
            {draftFilterCount > 0 ? (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground'
                onClick={handleClear}
              >
                {t('clearFilters')}
              </Button>
            ) : null}
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-9 w-9 rounded-full p-0 text-muted-foreground hover:text-foreground'
              aria-label={tCommon('close')}
              onClick={handleClose}
            >
              <Icons.close className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-5 overscroll-contain'>
          <MarketplaceFilterSidebar
            filters={draftFilters}
            onChange={setDraftFilters}
            showHeader={false}
            className='border-0 bg-transparent p-0 shadow-none'
          />
        </div>

        <div className='shrink-0 border-t border-border/70 p-4 sm:px-5 bg-background/95 backdrop-blur-xs flex items-center gap-3'>
          <Button
            type='button'
            variant='outline'
            className='h-12 min-h-[48px] rounded-xl font-bold flex-1 border-border/80'
            onClick={handleClear}
            disabled={draftFilterCount === 0}
          >
            {t('clearFilters')}
          </Button>

          <Button
            type='button'
            className='h-12 min-h-[48px] rounded-xl font-bold flex-[1.5] shadow-sm'
            onClick={handleApply}
          >
            {t('showResults')}
            {resultsSuffix}
          </Button>
        </div>
      </div>
    </div>
  );
}
