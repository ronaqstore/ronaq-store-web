'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { mergeMarketplaceFilters } from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type { QuickFilterChipsProps, MarketplaceListingFilters } from '@/types/marketplace';

export function QuickFilterChips({
  filters,
  onChange,
  className
}: QuickFilterChipsProps) {
  const t = useTranslations('marketplace');
  const [optimistic, setOptimistic] = useState<MarketplaceListingFilters>(filters);

  useEffect(() => {
    setOptimistic(filters);
  }, [filters]);

  const isAllActive =
    !optimistic.category &&
    optimistic.inStock === undefined &&
    !optimistic.ptaStatus &&
    !optimistic.condition &&
    optimistic.minPriceRs == null &&
    optimistic.maxPriceRs == null;

  const commit = (next: MarketplaceListingFilters) => {
    setOptimistic(next);
    onChange(next);
  };

  const handleToggle = (updates: Partial<MarketplaceListingFilters>) => {
    commit(mergeMarketplaceFilters(optimistic, updates));
  };

  const handleSelectAll = () => {
    commit(
      mergeMarketplaceFilters(optimistic, {
        category: undefined,
        inStock: undefined,
        ptaStatus: undefined,
        condition: undefined,
        minPriceRs: undefined,
        maxPriceRs: undefined
      })
    );
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto py-1 ps-4 pe-4 sm:ps-0 sm:pe-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory',
        className
      )}
      role='toolbar'
      aria-label={t('filtersHeading')}
    >
      <button
        suppressHydrationWarning
        type='button'
        onClick={handleSelectAll}
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          isAllActive
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterAll')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            category: optimistic.category === 'Mobile Phones' ? undefined : 'Mobile Phones'
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.category === 'Mobile Phones'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterMobiles')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            category: optimistic.category === 'Accessories' ? undefined : 'Accessories'
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.category === 'Accessories'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterAccessories')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            inStock: optimistic.inStock === true ? undefined : true
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.inStock === true
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterInStock')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            ptaStatus: optimistic.ptaStatus === 'PTA_APPROVED' ? undefined : 'PTA_APPROVED'
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.ptaStatus === 'PTA_APPROVED'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterPta')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            condition: optimistic.condition === 'NEW' ? undefined : 'NEW'
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.condition === 'NEW'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterNew')}
      </button>

      <button
        suppressHydrationWarning
        type='button'
        onClick={() =>
          handleToggle({
            condition: optimistic.condition === 'USED' ? undefined : 'USED'
          })
        }
        className={cn(
          'snap-start shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors select-none active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          optimistic.condition === 'USED'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border/80 bg-card text-foreground hover:bg-muted/60'
        )}
      >
        {t('quickFilterUsed')}
      </button>
    </div>
  );
}
