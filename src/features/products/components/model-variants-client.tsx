'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/products/product-card';
import { formatPrice, buildWhatsAppLink } from '@/lib/formatters';
import type {
  ModelUnitRow,
  ModelVariantsClientProps
} from '@/types/product';

export function ModelVariantsClient({
  variants,
  storeSlug,
  storeName,
  storePhone,
  isAppleBrand
}: ModelVariantsClientProps) {
  const t = useTranslations('catalog');
  const [pta, setPta] = useState('ALL');
  const [color, setColor] = useState('ALL');
  const [storage, setStorage] = useState('ALL');
  const [condition, setCondition] = useState('ALL');
  const [batteryMin, setBatteryMin] = useState('');

  const colors = useMemo(
    () =>
      [...new Set(variants.map((v) => v.color).filter(Boolean) as string[])].sort(),
    [variants]
  );
  const storages = useMemo(
    () =>
      [...new Set(variants.map((v) => v.storage).filter(Boolean) as string[])].sort(),
    [variants]
  );
  const ptaOptions = useMemo(
    () =>
      [...new Set(variants.map((v) => v.ptaStatus).filter(Boolean) as string[])].sort(),
    [variants]
  );

  const filteredVariants = useMemo(() => {
    return variants.filter((v) => {
      if (pta !== 'ALL' && v.ptaStatus !== pta) return false;
      if (color !== 'ALL' && v.color !== color) return false;
      if (storage !== 'ALL' && v.storage !== storage) return false;
      return true;
    });
  }, [variants, pta, color, storage]);

  const unitRows = useMemo(() => {
    const min = batteryMin.trim() ? Number(batteryMin) : null;
    const rows: ModelUnitRow[] = [];
    for (const variant of filteredVariants) {
      for (const unit of variant.units ?? []) {
        if (condition !== 'ALL' && unit.condition !== condition) continue;
        if (
          min != null &&
          !Number.isNaN(min) &&
          (unit.batteryHealth == null || unit.batteryHealth < min)
        ) {
          continue;
        }
        rows.push({ ...unit, variant });
      }
    }
    return rows;
  }, [filteredVariants, condition, batteryMin]);

  const selectClass =
    'h-9 rounded-md border border-border bg-background px-2 text-xs text-foreground';

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-end gap-2'>
        {ptaOptions.length > 0 ? (
          <label className='space-y-1 text-xs'>
            <span className='text-muted-foreground'>{t('ptaStatusLabel')}</span>
            <select
              className={selectClass}
              value={pta}
              onChange={(e) => setPta(e.target.value)}
            >
              <option value='ALL'>{t('filterAll')}</option>
              {ptaOptions.map((value) => (
                <option key={value} value={value}>
                  {value.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {colors.length > 0 ? (
          <label className='space-y-1 text-xs'>
            <span className='text-muted-foreground'>{t('color')}</span>
            <select
              className={selectClass}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value='ALL'>{t('filterAll')}</option>
              {colors.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {storages.length > 0 ? (
          <label className='space-y-1 text-xs'>
            <span className='text-muted-foreground'>{t('storage')}</span>
            <select
              className={selectClass}
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            >
              <option value='ALL'>{t('filterAll')}</option>
              {storages.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className='space-y-1 text-xs'>
          <span className='text-muted-foreground'>{t('condition')}</span>
          <select
            className={selectClass}
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value='ALL'>{t('filterAll')}</option>
            <option value='NEW'>{t('conditionNew')}</option>
            <option value='USED'>{t('conditionUsed')}</option>
          </select>
        </label>
        {isAppleBrand ? (
          <label className='space-y-1 text-xs'>
            <span className='text-muted-foreground'>{t('batteryMin')}</span>
            <input
              type='number'
              min={1}
              max={100}
              className={`${selectClass} w-24`}
              value={batteryMin}
              onChange={(e) => setBatteryMin(e.target.value)}
              placeholder='90'
            />
          </label>
        ) : null}
      </div>

      {filteredVariants.length === 0 ? (
        <p className='text-muted-foreground text-sm'>{t('noProducts')}</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {filteredVariants.map((product, index) => (
            <ProductCard
              key={product.id}
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

      {unitRows.length > 0 ? (
        <section className='space-y-3' aria-labelledby='in-stock-units-heading'>
          <h2 id='in-stock-units-heading' className='text-lg font-semibold tracking-tight'>
            {t('inStockPhones', { count: unitRows.length })}
          </h2>
          <p className='text-muted-foreground text-sm'>{t('inStockPhonesHelp')}</p>
          <ul className='divide-y divide-border rounded-lg border border-border'>
            {unitRows.map((row) => {
              const priceLabel = row.variant.contactForPrice
                ? t('contactForPrice')
                : formatPrice(row.price ?? row.variant.retailPrice);
              const message = t('unitWhatsAppMessage', {
                store: storeName,
                product: row.variant.name,
                imei: row.imeiMasked,
                condition: row.condition,
                battery:
                  row.batteryHealth != null
                    ? t('batteryPct', { pct: row.batteryHealth })
                    : '—'
              });
              const href = buildWhatsAppLink(storePhone, message);
              return (
                <li
                  key={row.id}
                  className='flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between'
                >
                  <div className='space-y-0.5 text-sm'>
                    <p className='font-medium'>{row.variant.name}</p>
                    <p className='text-muted-foreground text-xs'>
                      {[
                        row.condition,
                        row.imeiMasked,
                        row.batteryHealth != null
                          ? t('batteryPct', { pct: row.batteryHealth })
                          : null,
                        row.variant.ptaStatus
                          ? row.variant.ptaStatus.replaceAll('_', ' ')
                          : null,
                        row.defectNotes
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-sm font-semibold tabular-nums'>{priceLabel}</span>
                    <a
                      href={href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-medium text-primary underline-offset-4 hover:underline'
                    >
                      {t('inquireWhatsApp')}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
