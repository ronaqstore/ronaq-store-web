'use client';

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { FilterSection } from './filter-section';
import {
  formatMarketplacePriceRs,
  MARKETPLACE_PRICE_RS_MAX
} from '@/lib/marketplace-filters';
import type { MarketplacePriceFilterSectionProps } from '@/types/marketplace';

export const MARKETPLACE_PRICE_BOUNDS = {
  min: 0,
  max: Math.min(2_000_000, MARKETPLACE_PRICE_RS_MAX),
  step: 5_000
} as const;

function toSliderPair(minPriceRs?: number, maxPriceRs?: number): [number, number] {
  const low =
    minPriceRs != null && minPriceRs > 0
      ? Math.min(MARKETPLACE_PRICE_BOUNDS.max, minPriceRs)
      : MARKETPLACE_PRICE_BOUNDS.min;
  const high =
    maxPriceRs != null && maxPriceRs > 0
      ? Math.min(MARKETPLACE_PRICE_BOUNDS.max, maxPriceRs)
      : MARKETPLACE_PRICE_BOUNDS.max;
  return [low, Math.max(low, high)];
}

function toDraftString(value?: number): string {
  return value != null && value > 0 ? String(value) : '';
}

function parseDraftNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (!/^\d+$/.test(trimmed)) return undefined;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.min(MARKETPLACE_PRICE_RS_MAX, Math.floor(n));
}

export function PriceFilterSection({
  minPriceRs,
  maxPriceRs,
  onChange,
  open,
  onToggle
}: MarketplacePriceFilterSectionProps) {
  const t = useTranslations('marketplace');
  const editingRef = useRef(false);
  const [draftMin, setDraftMin] = useState(() => toDraftString(minPriceRs));
  const [draftMax, setDraftMax] = useState(() => toDraftString(maxPriceRs));
  const [sliderValue, setSliderValue] = useState<[number, number]>(() =>
    toSliderPair(minPriceRs, maxPriceRs)
  );

  useEffect(() => {
    if (editingRef.current) return;
    setDraftMin(toDraftString(minPriceRs));
    setDraftMax(toDraftString(maxPriceRs));
    setSliderValue(toSliderPair(minPriceRs, maxPriceRs));
  }, [minPriceRs, maxPriceRs]);

  const commitPriceDraft = (minRs: number | undefined, maxRs: number | undefined) => {
    let nextMin = minRs != null && minRs > 0 ? minRs : undefined;
    let nextMax = maxRs != null && maxRs > 0 ? maxRs : undefined;
    if (nextMin != null && nextMax != null && nextMax < nextMin) {
      const swap = nextMin;
      nextMin = nextMax;
      nextMax = swap;
    }
    onChange({ minPriceRs: nextMin, maxPriceRs: nextMax });
  };

  const commitPriceFromInputs = () => {
    editingRef.current = false;
    const nextMin = parseDraftNumber(draftMin);
    const nextMax = parseDraftNumber(draftMax);
    if (draftMin.trim() !== '' && nextMin == null) {
      setDraftMin(toDraftString(minPriceRs));
      setDraftMax(toDraftString(maxPriceRs));
      setSliderValue(toSliderPair(minPriceRs, maxPriceRs));
      return;
    }
    if (draftMax.trim() !== '' && nextMax == null) {
      setDraftMin(toDraftString(minPriceRs));
      setDraftMax(toDraftString(maxPriceRs));
      setSliderValue(toSliderPair(minPriceRs, maxPriceRs));
      return;
    }

    let low = nextMin;
    let high = nextMax;
    if (low != null && high != null && low > high) {
      const swap = low;
      low = high;
      high = swap;
    }

    setDraftMin(toDraftString(low));
    setDraftMax(toDraftString(high));
    setSliderValue(toSliderPair(low, high));
    commitPriceDraft(low, high);
  };

  const handleSliderChange = (next: [number, number]) => {
    setSliderValue(next);
    setDraftMin(next[0] <= MARKETPLACE_PRICE_BOUNDS.min ? '' : String(next[0]));
    setDraftMax(next[1] >= MARKETPLACE_PRICE_BOUNDS.max ? '' : String(next[1]));
  };

  const handleSliderCommit = (next: [number, number]) => {
    const nextMin = next[0] <= MARKETPLACE_PRICE_BOUNDS.min ? undefined : next[0];
    const nextMax = next[1] >= MARKETPLACE_PRICE_BOUNDS.max ? undefined : next[1];
    setSliderValue(toSliderPair(nextMin, nextMax));
    setDraftMin(toDraftString(nextMin));
    setDraftMax(toDraftString(nextMax));
    commitPriceDraft(nextMin, nextMax);
  };

  const handleDraftMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/[^\d]/g, '');
    setDraftMin(raw);
  };

  const handleDraftMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/[^\d]/g, '');
    setDraftMax(raw);
  };

  const handleFocus = () => {
    editingRef.current = true;
  };

  const handlePriceKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitPriceFromInputs();
      event.currentTarget.blur();
    }
  };

  return (
    <FilterSection title={t('priceRange')} open={open} onToggle={onToggle}>
      <div className='space-y-3 px-1'>
        <div className='flex items-center justify-between gap-2 text-sm font-semibold text-foreground'>
          <span>{formatMarketplacePriceRs(sliderValue[0])}</span>
          <span className='text-xs font-normal text-muted-foreground'>—</span>
          <span>
            {sliderValue[1] >= MARKETPLACE_PRICE_BOUNDS.max
              ? `${formatMarketplacePriceRs(MARKETPLACE_PRICE_BOUNDS.max)}+`
              : formatMarketplacePriceRs(sliderValue[1])}
          </span>
        </div>
        <PriceRangeSlider
          min={MARKETPLACE_PRICE_BOUNDS.min}
          max={MARKETPLACE_PRICE_BOUNDS.max}
          step={MARKETPLACE_PRICE_BOUNDS.step}
          value={sliderValue}
          onChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
        />
        <div className='grid grid-cols-2 gap-2'>
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-muted-foreground'>
              {t('priceMin')}
            </label>
            <div className='relative'>
              <span className='pointer-events-none absolute inset-y-0 inset-s-2.5 flex items-center text-xs text-muted-foreground'>
                {t('priceCurrencyPrefix')}
              </span>
              <Input
                type='text'
                inputMode='numeric'
                autoComplete='off'
                placeholder='0'
                value={draftMin}
                onFocus={handleFocus}
                onChange={handleDraftMinChange}
                onBlur={commitPriceFromInputs}
                onKeyDown={handlePriceKeyDown}
                className='h-11 ps-8 text-base rounded-xl'
              />
            </div>
          </div>
          <div className='space-y-1'>
            <label className='text-[11px] font-medium text-muted-foreground'>
              {t('priceMax')}
            </label>
            <div className='relative'>
              <span className='pointer-events-none absolute inset-y-0 inset-s-2.5 flex items-center text-xs text-muted-foreground'>
                {t('priceCurrencyPrefix')}
              </span>
              <Input
                type='text'
                inputMode='numeric'
                autoComplete='off'
                placeholder={String(MARKETPLACE_PRICE_BOUNDS.max)}
                value={draftMax}
                onFocus={handleFocus}
                onChange={handleDraftMaxChange}
                onBlur={commitPriceFromInputs}
                onKeyDown={handlePriceKeyDown}
                className='h-11 ps-8 text-base rounded-xl'
              />
            </div>
          </div>
        </div>
      </div>
    </FilterSection>
  );
}
