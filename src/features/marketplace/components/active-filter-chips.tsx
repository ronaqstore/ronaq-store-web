'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { formatMarketplacePriceRs } from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type {
  ActiveFilterChipItem,
  ActiveFilterChipsProps,
  MarketplaceListingFilters
} from '@/types/marketplace';

export function ActiveFilterChips({
  filters,
  searchQuery,
  modelKey,
  onChange,
  onClearSearch,
  onClearAll,
  className
}: ActiveFilterChipsProps) {
  const t = useTranslations('marketplace');
  const tAria = useTranslations('aria');

  const items: ActiveFilterChipItem[] = [];

  if (searchQuery) {
    items.push({
      id: 'search',
      label: `"${searchQuery}"`,
      onRemove: () => onClearSearch?.()
    });
  }

  if (modelKey && !searchQuery) {
    items.push({
      id: 'model',
      label: modelKey,
      onRemove: () => onClearSearch?.()
    });
  }

  if (filters.category) {
    items.push({
      id: 'category',
      label: filters.category,
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.category;
        onChange(next);
      }
    });
  }

  if (filters.condition) {
    items.push({
      id: 'condition',
      label: filters.condition === 'NEW' ? t('quickFilterNew') : t('quickFilterUsed'),
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.condition;
        onChange(next);
      }
    });
  }

  if (filters.inStock === true) {
    items.push({
      id: 'inStock',
      label: t('quickFilterInStock'),
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.inStock;
        onChange(next);
      }
    });
  }

  if (filters.ptaStatus) {
    items.push({
      id: 'pta',
      label: filters.ptaStatus.replace('_', ' '),
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.ptaStatus;
        onChange(next);
      }
    });
  }

  if (filters.authenticity) {
    items.push({
      id: 'auth',
      label: filters.authenticity,
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.authenticity;
        onChange(next);
      }
    });
  }

  if (filters.minPriceRs != null || filters.maxPriceRs != null) {
    const minStr = filters.minPriceRs != null ? formatMarketplacePriceRs(filters.minPriceRs) : 'Rs 0';
    const maxStr = filters.maxPriceRs != null ? formatMarketplacePriceRs(filters.maxPriceRs) : '...';
    items.push({
      id: 'price',
      label: `${minStr} - ${maxStr}`,
      onRemove: () => {
        const next: MarketplaceListingFilters = { ...filters };
        delete next.minPriceRs;
        delete next.maxPriceRs;
        onChange(next);
      }
    });
  }

  if (items.length === 0) return null;

  return (
    <div
      className={cn('flex flex-wrap items-center gap-1.5 py-1', className)}
      role='region'
      aria-label={t('filtersHeading')}
    >
      {items.map((item) => (
        <span
          key={item.id}
          className='inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 ps-2.5 pe-1.5 py-1 text-xs font-medium text-primary'
        >
          <span className='truncate max-w-[180px]'>{item.label}</span>
          <button
            type='button'
            onClick={item.onRemove}
            className='inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20 active:scale-95'
            aria-label={tAria('removeFilter', { label: item.label })}
          >
            <Icons.close className='h-3 w-3' />
          </button>
        </span>
      ))}

      <button
        type='button'
        onClick={onClearAll}
        className='ms-1 text-xs font-semibold text-muted-foreground hover:text-foreground underline-offset-4 hover:underline'
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}
