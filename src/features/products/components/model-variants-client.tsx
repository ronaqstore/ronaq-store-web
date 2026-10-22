'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { FacetedFilter } from '@/components/ui/faceted-filter';
import { Input } from '@/components/ui/input';
import { formatColorLabel, formatStorageLabel } from '@/lib/formatters';
import type { ModelVariantsClientProps } from '@/types/product';

function ptaLabel(status: string, labels: Record<string, string>): string {
  return labels[status] ?? status.replaceAll('_', ' ');
}

export function ModelVariantsClient({
  variants,
  storeSlug,
  storeName,
  storePhone,
  isAppleBrand
}: ModelVariantsClientProps) {
  const t = useTranslations('catalog');
  const [pta, setPta] = useState('');
  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  const [condition, setCondition] = useState('');
  const [batteryMin, setBatteryMin] = useState('');
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const ptaLabels = useMemo(
    () => ({
      APPROVED: t('ptaApproved'),
      NON_PTA: t('ptaNon'),
      JV: t('ptaJv'),
      BYPASS: t('ptaBypass'),
      MDM_BYPASS: t('ptaMdmBypass')
    }),
    [t]
  );

  const colorOptions = useMemo(
    () =>
      [...new Set(variants.map((v) => v.color).filter(Boolean) as string[])]
        .sort()
        .map((value) => ({ value, label: formatColorLabel(value) || value })),
    [variants]
  );
  const storageOptions = useMemo(
    () =>
      [...new Set(variants.map((v) => v.storage).filter(Boolean) as string[])]
        .sort()
        .map((value) => ({ value, label: formatStorageLabel(value) || value })),
    [variants]
  );
  const ptaOptions = useMemo(
    () =>
      [...new Set(variants.map((v) => v.ptaStatus).filter(Boolean) as string[])]
        .sort()
        .map((value) => ({ value, label: ptaLabel(value, ptaLabels) })),
    [variants, ptaLabels]
  );
  const conditionOptions = useMemo(
    () => [
      { value: 'NEW', label: t('conditionNew') },
      { value: 'USED', label: t('conditionUsed') }
    ],
    [t]
  );

  const filteredVariants = useMemo(() => {
    const min = batteryMin.trim() ? Number(batteryMin) : null;

    return variants.filter((variant) => {
      if (pta && variant.ptaStatus !== pta) return false;
      if (color && variant.color !== color) return false;
      if (storage && variant.storage !== storage) return false;

      const units = variant.units ?? [];
      if (!condition && (min == null || Number.isNaN(min))) return true;

      if (units.length > 0) {
        return units.some((unit) => {
          if (condition && unit.condition !== condition) return false;
          if (
            min != null &&
            !Number.isNaN(min) &&
            (unit.batteryHealth == null || unit.batteryHealth < min)
          ) {
            return false;
          }
          return true;
        });
      }

      if (condition && variant.condition !== condition) return false;
      return true;
    });
  }, [variants, pta, color, storage, condition, batteryMin]);

  const hasActiveFilters = Boolean(pta || color || storage || condition || batteryMin.trim());

  const resetFilters = () => {
    setPta('');
    setColor('');
    setStorage('');
    setCondition('');
    setBatteryMin('');
    setOpenFilter(null);
  };

  const bindOpen = (key: string) => ({
    open: openFilter === key,
    onOpenChange: (next: boolean) => setOpenFilter(next ? key : null)
  });

  return (
    <div className='space-y-6 sm:space-y-8'>
      <div className='flex flex-wrap items-center gap-2'>
        {ptaOptions.length > 0 ? (
          <FacetedFilter
            title={t('ptaStatusLabel')}
            options={ptaOptions}
            value={pta}
            onChange={setPta}
            {...bindOpen('pta')}
          />
        ) : null}
        {colorOptions.length > 0 ? (
          <FacetedFilter
            title={t('color')}
            options={colorOptions}
            value={color}
            onChange={setColor}
            {...bindOpen('color')}
          />
        ) : null}
        {storageOptions.length > 0 ? (
          <FacetedFilter
            title={t('storage')}
            options={storageOptions}
            value={storage}
            onChange={setStorage}
            {...bindOpen('storage')}
          />
        ) : null}
        <FacetedFilter
          title={t('condition')}
          options={conditionOptions}
          value={condition}
          onChange={setCondition}
          {...bindOpen('condition')}
        />
        {isAppleBrand ? (
          <div className='flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border bg-background px-2'>
            <span className='text-muted-foreground shrink-0 text-xs'>{t('batteryMin')}</span>
            <Input
              type='number'
              min={1}
              max={100}
              value={batteryMin}
              onChange={(e) => setBatteryMin(e.target.value)}
              placeholder='90'
              className='h-6 w-14 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0'
            />
          </div>
        ) : null}
        {hasActiveFilters ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 px-2 text-xs'
            onClick={resetFilters}
          >
            {t('resetFilters')}
          </Button>
        ) : null}
      </div>

      {filteredVariants.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{t('noProducts')}</p>
      ) : (
        <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
          {filteredVariants.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              storeSlug={storeSlug}
              storeName={storeName}
              storePhone={storePhone}
              priority={index < 4}
              linkToModel={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
