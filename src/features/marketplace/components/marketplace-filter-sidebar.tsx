'use client';

import { useEffect, useId, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { Icons } from '@/components/icons';
import {
  countActiveMarketplaceFilters,
  formatMarketplacePriceRs,
  MARKETPLACE_PRICE_RS_MAX
} from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import type {
  MarketplaceFilterOptionRowProps,
  MarketplaceFilterSectionProps,
  MarketplaceFiltersBarProps,
  MarketplaceListingFilters
} from '@/types/marketplace';

export const MARKETPLACE_PRICE_BOUNDS = {
  min: 0,
  max: Math.min(300_000, MARKETPLACE_PRICE_RS_MAX),
  step: 1_000
} as const;

const PTA_OPTIONS = [
  'PTA_APPROVED',
  'NON_PTA',
  'JV',
  'BYPASS',
  'MDM_BYPASS'
] as const;

function FilterSection({
  title,
  defaultOpen = true,
  children
}: MarketplaceFilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  const handleToggle = () => {
    setOpen((value) => !value);
  };

  return (
    <div className='border-b border-border/70 last:border-b-0'>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className='flex w-full items-center justify-between gap-2 py-3 text-start'
      >
        <span className='text-sm font-semibold tracking-tight text-foreground'>{title}</span>
        <Icons.chevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open ? (
        <div id={panelId} className='space-y-2 pb-4'>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function OptionRow({
  active,
  label,
  onClick,
  shape = 'radio'
}: MarketplaceFilterOptionRowProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-start text-sm transition-colors',
        active
          ? 'bg-primary/10 font-medium text-foreground'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center border',
          shape === 'radio' ? 'rounded-full' : 'rounded',
          active
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-background'
        )}
      >
        {active ? <Icons.check className='h-2.5 w-2.5' /> : null}
      </span>
      <span className='truncate'>{label}</span>
    </button>
  );
}

export function MarketplaceFilterSidebar({
  filters,
  onChange,
  className,
  showHeader = true
}: MarketplaceFiltersBarProps) {
  const t = useTranslations();
  const activeCount = countActiveMarketplaceFilters(filters);
  const [draftMin, setDraftMin] = useState(String(filters.minPriceRs ?? MARKETPLACE_PRICE_BOUNDS.min));
  const [draftMax, setDraftMax] = useState(String(filters.maxPriceRs ?? MARKETPLACE_PRICE_BOUNDS.max));
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    filters.minPriceRs ?? MARKETPLACE_PRICE_BOUNDS.min,
    filters.maxPriceRs ?? MARKETPLACE_PRICE_BOUNDS.max
  ]);

  useEffect(() => {
    const min = filters.minPriceRs ?? MARKETPLACE_PRICE_BOUNDS.min;
    const max = filters.maxPriceRs ?? MARKETPLACE_PRICE_BOUNDS.max;
    setDraftMin(String(min));
    setDraftMax(String(max));
    setSliderValue([min, max]);
  }, [filters.minPriceRs, filters.maxPriceRs]);

  const patch = (partial: Partial<MarketplaceListingFilters>) => {
    const next: MarketplaceListingFilters = { ...filters, ...partial };
    (Object.keys(partial) as Array<keyof MarketplaceListingFilters>).forEach((key) => {
      if (partial[key] === undefined) {
        delete next[key];
      }
    });
    onChange(next);
  };

  const commitPriceDraft = (minRs: number, maxRs: number) => {
    const low = Math.max(MARKETPLACE_PRICE_BOUNDS.min, Math.min(minRs, maxRs));
    const high = Math.min(MARKETPLACE_PRICE_BOUNDS.max, Math.max(minRs, maxRs));
    const nextMin = low <= MARKETPLACE_PRICE_BOUNDS.min ? undefined : low;
    const nextMax = high >= MARKETPLACE_PRICE_BOUNDS.max ? undefined : high;
    patch({ minPriceRs: nextMin, maxPriceRs: nextMax });
  };

  const commitPriceFromInputs = () => {
    const min = Number(draftMin);
    const max = Number(draftMax);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return;
    const flooredMin = Math.floor(min);
    const flooredMax = Math.floor(max);
    setSliderValue([
      Math.max(MARKETPLACE_PRICE_BOUNDS.min, Math.min(flooredMin, flooredMax)),
      Math.min(MARKETPLACE_PRICE_BOUNDS.max, Math.max(flooredMin, flooredMax))
    ]);
    commitPriceDraft(flooredMin, flooredMax);
  };

  const handleSliderChange = (next: [number, number]) => {
    setSliderValue(next);
    setDraftMin(String(next[0]));
    setDraftMax(String(next[1]));
    commitPriceDraft(next[0], next[1]);
  };

  const handleDraftMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraftMin(value);
    const min = Number(value);
    const max = Number(draftMax);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return;
    commitPriceDraft(Math.floor(min), Math.floor(max));
  };

  const handleDraftMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDraftMax(value);
    const min = Number(draftMin);
    const max = Number(value);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return;
    commitPriceDraft(Math.floor(min), Math.floor(max));
  };

  const handlePriceKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') commitPriceFromInputs();
  };

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
        <FilterSection title={t('catalog.condition')}>
          <OptionRow
            active={!filters.condition}
            label={t('marketplace.filterConditionAll')}
            onClick={() => patch({ condition: undefined })}
          />
          <OptionRow
            active={filters.condition === 'NEW'}
            label={t('catalog.conditionNew')}
            onClick={() =>
              patch({ condition: filters.condition === 'NEW' ? undefined : 'NEW' })
            }
          />
          <OptionRow
            active={filters.condition === 'USED'}
            label={t('catalog.conditionUsed')}
            onClick={() =>
              patch({ condition: filters.condition === 'USED' ? undefined : 'USED' })
            }
          />
        </FilterSection>

        <FilterSection title={t('marketplace.priceRange')}>
          <div className='space-y-3 px-1'>
            <div className='flex items-center justify-between gap-2 text-sm font-semibold text-foreground'>
              <span>{formatMarketplacePriceRs(sliderValue[0])}</span>
              <span className='text-xs font-normal text-muted-foreground'>—</span>
              <span>{formatMarketplacePriceRs(sliderValue[1])}</span>
            </div>
            <PriceRangeSlider
              min={MARKETPLACE_PRICE_BOUNDS.min}
              max={MARKETPLACE_PRICE_BOUNDS.max}
              step={MARKETPLACE_PRICE_BOUNDS.step}
              value={sliderValue}
              onChange={handleSliderChange}
            />
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-muted-foreground'>
                  {t('marketplace.priceMin')}
                </label>
                <div className='relative'>
                  <span className='pointer-events-none absolute inset-y-0 inset-s-2.5 flex items-center text-xs text-muted-foreground'>
                    {t('marketplace.priceCurrencyPrefix')}
                  </span>
                  <Input
                    type='number'
                    inputMode='numeric'
                    min={MARKETPLACE_PRICE_BOUNDS.min}
                    max={MARKETPLACE_PRICE_BOUNDS.max}
                    value={draftMin}
                    onChange={handleDraftMinChange}
                    onBlur={commitPriceFromInputs}
                    onKeyDown={handlePriceKeyDown}
                    className='h-9 ps-8'
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-[11px] font-medium text-muted-foreground'>
                  {t('marketplace.priceMax')}
                </label>
                <div className='relative'>
                  <span className='pointer-events-none absolute inset-y-0 inset-s-2.5 flex items-center text-xs text-muted-foreground'>
                    {t('marketplace.priceCurrencyPrefix')}
                  </span>
                  <Input
                    type='number'
                    inputMode='numeric'
                    min={MARKETPLACE_PRICE_BOUNDS.min}
                    max={MARKETPLACE_PRICE_BOUNDS.max}
                    value={draftMax}
                    onChange={handleDraftMaxChange}
                    onBlur={commitPriceFromInputs}
                    onKeyDown={handlePriceKeyDown}
                    className='h-9 ps-8'
                  />
                </div>
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection title={t('marketplace.availability')}>
          <OptionRow
            active={filters.inStock === undefined}
            label={t('marketplace.filterStockAll')}
            onClick={() => patch({ inStock: undefined })}
          />
          <OptionRow
            active={filters.inStock === true}
            label={t('catalog.inStock')}
            onClick={() =>
              patch({ inStock: filters.inStock === true ? undefined : true })
            }
          />
          <OptionRow
            active={filters.inStock === false}
            label={t('catalog.outOfStock')}
            onClick={() =>
              patch({ inStock: filters.inStock === false ? undefined : false })
            }
          />
        </FilterSection>

        <FilterSection title={t('catalog.ptaStatusLabel')} defaultOpen={false}>
          <OptionRow
            active={!filters.ptaStatus}
            label={t('marketplace.filterPtaAll')}
            onClick={() => patch({ ptaStatus: undefined })}
          />
          {PTA_OPTIONS.map((status) => (
            <OptionRow
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

        <FilterSection title={t('marketplace.authenticityHeading')} defaultOpen={false}>
          <OptionRow
            active={!filters.authenticity}
            label={t('marketplace.filterAuthAll')}
            onClick={() => patch({ authenticity: undefined })}
          />
          <OptionRow
            active={filters.authenticity === 'ORIGINAL'}
            label={t('catalog.authenticityOriginal')}
            onClick={() =>
              patch({
                authenticity:
                  filters.authenticity === 'ORIGINAL' ? undefined : 'ORIGINAL'
              })
            }
          />
          <OptionRow
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
