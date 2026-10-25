'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { FilterOptionRow, FilterSection } from './filter-section';
import { PriceFilterSection } from './price-filter-section';
import { countActiveMarketplaceFilters } from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type {
  MarketplaceFilterSectionKey,
  MarketplaceFiltersBarProps,
  MarketplaceListingFilters
} from '@/types/marketplace';

const PTA_OPTIONS = [
  'PTA_APPROVED',
  'NON_PTA',
  'JV',
  'BYPASS',
  'MDM_BYPASS'
] as const;

const SECTION_KEYS: MarketplaceFilterSectionKey[] = [
  'condition',
  'price',
  'availability',
  'pta',
  'authenticity'
];

const ALL_SECTIONS_OPEN: Record<MarketplaceFilterSectionKey, boolean> = {
  condition: true,
  price: true,
  availability: true,
  pta: true,
  authenticity: true
};

const ALL_SECTIONS_CLOSED: Record<MarketplaceFilterSectionKey, boolean> = {
  condition: false,
  price: false,
  availability: false,
  pta: false,
  authenticity: false
};

function hasAnyActiveFilters(filters: MarketplaceListingFilters): boolean {
  return countActiveMarketplaceFilters(filters) > 0;
}

export function MarketplaceFilterSidebar({
  filters,
  onChange,
  className,
  showHeader = true
}: MarketplaceFiltersBarProps) {
  const t = useTranslations();
  const activeCount = countActiveMarketplaceFilters(filters);
  const [openSections, setOpenSections] = useState<
    Record<MarketplaceFilterSectionKey, boolean>
  >(ALL_SECTIONS_OPEN);

  useEffect(() => {
    if (!hasAnyActiveFilters(filters)) {
      setOpenSections(ALL_SECTIONS_OPEN);
    }
  }, [filters]);

  const patch = (partial: Partial<MarketplaceListingFilters>) => {
    const next: MarketplaceListingFilters = { ...filters, ...partial };
    (Object.keys(partial) as Array<keyof MarketplaceListingFilters>).forEach((key) => {
      if (partial[key] === undefined) {
        delete next[key];
      }
    });
    onChange(next);
  };

  const toggleSection = (key: MarketplaceFilterSectionKey) => {
    setOpenSections((current) => {
      const openCount = SECTION_KEYS.filter((section) => current[section]).length;
      if (openCount > 1) {
        return { ...ALL_SECTIONS_CLOSED, [key]: true };
      }
      if (current[key]) {
        return ALL_SECTIONS_OPEN;
      }
      return { ...ALL_SECTIONS_CLOSED, [key]: true };
    });
  };

  const handleToggleCondition = () => toggleSection('condition');
  const handleTogglePrice = () => toggleSection('price');
  const handleToggleAvailability = () => toggleSection('availability');
  const handleTogglePta = () => toggleSection('pta');
  const handleToggleAuthenticity = () => toggleSection('authenticity');

  const ptaLabel = (status: (typeof PTA_OPTIONS)[number]) => {
    switch (status) {
      case 'PTA_APPROVED':
        return t('catalog.ptaApproved');
      case 'NON_PTA':
        return t('catalog.ptaNon');
      case 'JV':
        return t('catalog.ptaJv');
      case 'BYPASS':
        return t('catalog.ptaBypass');
      case 'MDM_BYPASS':
        return t('catalog.ptaMdmBypass');
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5',
        className
      )}
    >
      {showHeader ? (
        <div className='mb-1 flex items-center justify-between gap-2 border-b border-border/70 pb-3'>
          <div className='flex items-center gap-2'>
            <Icons.filter className='h-4 w-4 text-primary' />
            <p className='text-base font-semibold text-foreground'>
              {t('marketplace.filtersHeading')}
            </p>
            {activeCount > 0 ? (
              <span className='rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary'>
                {activeCount}
              </span>
            ) : null}
          </div>
          {activeCount > 0 ? (
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 px-2 text-xs'
              onClick={() =>
                onChange({
                  sort: filters.sort
                })
              }
            >
              {t('marketplace.clearFilters')}
            </Button>
          ) : null}
        </div>
      ) : null}

      <div>
        <FilterSection
          title={t('catalog.condition')}
          open={openSections.condition}
          onToggle={handleToggleCondition}
        >
          <FilterOptionRow
            active={!filters.condition}
            label={t('marketplace.filterConditionAll')}
            onClick={() => patch({ condition: undefined })}
          />
          <FilterOptionRow
            active={filters.condition === 'NEW'}
            label={t('catalog.conditionNew')}
            onClick={() =>
              patch({ condition: filters.condition === 'NEW' ? undefined : 'NEW' })
            }
          />
          <FilterOptionRow
            active={filters.condition === 'USED'}
            label={t('catalog.conditionUsed')}
            onClick={() =>
              patch({ condition: filters.condition === 'USED' ? undefined : 'USED' })
            }
          />
        </FilterSection>

        <PriceFilterSection
          minPriceRs={filters.minPriceRs}
          maxPriceRs={filters.maxPriceRs}
          onChange={patch}
          open={openSections.price}
          onToggle={handleTogglePrice}
        />

        <FilterSection
          title={t('marketplace.availability')}
          open={openSections.availability}
          onToggle={handleToggleAvailability}
        >
          <FilterOptionRow
            active={filters.inStock === undefined}
            label={t('marketplace.filterStockAll')}
            onClick={() => patch({ inStock: undefined })}
          />
          <FilterOptionRow
            active={filters.inStock === true}
            label={t('catalog.inStock')}
            onClick={() =>
              patch({ inStock: filters.inStock === true ? undefined : true })
            }
          />
          <FilterOptionRow
            active={filters.inStock === false}
            label={t('catalog.outOfStock')}
            onClick={() =>
              patch({ inStock: filters.inStock === false ? undefined : false })
            }
          />
        </FilterSection>

        <FilterSection
          title={t('catalog.ptaStatusLabel')}
          open={openSections.pta}
          onToggle={handleTogglePta}
        >
          <FilterOptionRow
            active={!filters.ptaStatus}
            label={t('marketplace.filterPtaAll')}
            onClick={() => patch({ ptaStatus: undefined })}
          />
          {PTA_OPTIONS.map((status) => (
            <FilterOptionRow
              key={status}
              active={filters.ptaStatus === status}
              label={ptaLabel(status)}
              onClick={() =>
                patch({
                  ptaStatus: filters.ptaStatus === status ? undefined : status
                })
              }
            />
          ))}
        </FilterSection>

        <FilterSection
          title={t('marketplace.authenticityHeading')}
          open={openSections.authenticity}
          onToggle={handleToggleAuthenticity}
        >
          <FilterOptionRow
            active={!filters.authenticity}
            label={t('marketplace.filterAuthAll')}
            onClick={() => patch({ authenticity: undefined })}
          />
          <FilterOptionRow
            active={filters.authenticity === 'ORIGINAL'}
            label={t('catalog.authenticityOriginal')}
            onClick={() =>
              patch({
                authenticity:
                  filters.authenticity === 'ORIGINAL' ? undefined : 'ORIGINAL'
              })
            }
          />
          <FilterOptionRow
            active={filters.authenticity === 'COPY'}
            label={t('catalog.authenticityCopy')}
            onClick={() =>
              patch({
                authenticity: filters.authenticity === 'COPY' ? undefined : 'COPY'
              })
            }
          />
        </FilterSection>
      </div>
    </div>
  );
}
