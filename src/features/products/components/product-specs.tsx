'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import {
  formatEmpty,
  formatPhone,
  formatTitleCase,
  formatStorageLabel,
  formatColorLabel
} from '@/lib/formatters';
import {
  productConditionMessageKey,
  resolveProductCondition
} from '@/lib/product-condition';
import { cn } from '@/lib/utils';
import type {
  ProductSpecsProps,
  ProductSpecRowItem,
  ProductSpecsMobileExpandedState
} from '@/types/product';

export function ProductSpecs({ product, store, slug }: ProductSpecsProps) {
  const t = useTranslations('catalog');
  const tStores = useTranslations('stores');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shop'>('specs');
  const [mobileExpanded, setMobileExpanded] = useState<ProductSpecsMobileExpandedState>({
    description: true,
    specs: true,
    shop: false
  });

  const condition = resolveProductCondition(product);
  const conditionLabel = condition ? t(productConditionMessageKey(condition)) : null;
  const storageLabel = formatStorageLabel(product.storage);
  const colorLabel = formatColorLabel(product.color);
  const ramLabel = product.ram ? formatStorageLabel(product.ram) : null;
  const storeName = store.displayName || store.name;
  const location = [store.address, store.city].filter(Boolean).join(', ') || store.city;
  const contactNumber = store.phoneNumber?.trim() || '';

  const getPtaLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return t('ptaApproved');
      case 'NON_PTA':
        return t('ptaNon');
      case 'JV':
        return t('ptaJv');
      case 'BYPASS':
        return t('ptaBypass');
      case 'MDM_BYPASS':
        return t('ptaMdmBypass');
      default:
        return status;
    }
  };

  const rawRows: Array<ProductSpecRowItem | null> = [
    product.model ? { label: t('model'), value: formatTitleCase(product.model) } : null,
    product.brandName ? { label: t('brand'), value: formatTitleCase(product.brandName) } : null,
    product.categoryName ? { label: t('category'), value: formatEmpty(product.categoryName) } : null,
    ramLabel ? { label: t('ram'), value: ramLabel } : null,
    storageLabel ? { label: t('storage'), value: storageLabel } : null,
    colorLabel ? { label: t('color'), value: colorLabel } : null,
    product.ptaStatus
      ? {
          label: t('ptaStatusLabel'),
          value: (
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold',
                product.ptaStatus === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-400' : ''
              )}
            >
              {product.ptaStatus === 'APPROVED' ? (
                <Icons.shieldCheck className='h-4 w-4 shrink-0' />
              ) : null}
              {getPtaLabel(product.ptaStatus)}
            </span>
          )
        }
      : null,
    conditionLabel ? { label: t('condition'), value: conditionLabel } : null,
    product.authenticity
      ? {
          label: t('authenticityLabel'),
          value:
            product.authenticity === 'ORIGINAL'
              ? t('authenticityOriginal')
              : t('authenticityCopy')
        }
      : null,
    product.warrantyType
      ? { label: t('warranty'), value: product.warrantyType }
      : null,
    product.sku
      ? { label: t('sku'), value: <span className='font-mono text-xs'>{product.sku}</span> }
      : null
  ];

  const specRows = rawRows.filter(
    (row): row is ProductSpecRowItem => row !== null
  );

  const toggleMobile = (key: 'description' | 'specs' | 'shop') => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className='w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-xs overflow-hidden'>
      <div className='hidden md:flex border-b border-border/70 bg-muted/20 px-4 sm:px-6'>
        <button
          type='button'
          onClick={() => setActiveTab('specs')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 px-4 text-sm font-bold transition-all focus:outline-none min-h-[44px]',
            activeTab === 'specs'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Icons.tag className='h-4 w-4 shrink-0' />
          <span>{t('tabSpecs')}</span>
          <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-semibold'>
            {specRows.length}
          </span>
        </button>

        {product.description ? (
          <button
            type='button'
            onClick={() => setActiveTab('description')}
            className={cn(
              'flex items-center gap-2 border-b-2 py-4 px-4 text-sm font-bold transition-all focus:outline-none min-h-[44px]',
              activeTab === 'description'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Icons.info className='h-4 w-4 shrink-0' />
            <span>{t('tabDescription')}</span>
          </button>
        ) : null}

        <button
          type='button'
          onClick={() => setActiveTab('shop')}
          className={cn(
            'flex items-center gap-2 border-b-2 py-4 px-4 text-sm font-bold transition-all focus:outline-none min-h-[44px]',
            activeTab === 'shop'
              ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Icons.store className='h-4 w-4 shrink-0' />
          <span>{t('tabShopInfo')}</span>
        </button>
      </div>

      <div className='hidden md:block p-5 sm:p-6 lg:p-8'>
        {activeTab === 'specs' ? (
          <div className='overflow-hidden rounded-2xl border border-border/70'>
            <table className='w-full text-start text-sm'>
              <tbody>
                {specRows.map((row, index) => (
                  <tr
                    key={row.label}
                    className={cn(
                      'border-b border-border/50 transition-colors last:border-b-0 max-[399px]:flex max-[399px]:flex-col',
                      index % 2 === 0 ? 'bg-muted/15' : 'bg-transparent'
                    )}
                  >
                    <td className='w-[35%] max-[399px]:w-full py-3.5 px-4 sm:px-6 font-semibold text-muted-foreground'>
                      {row.label}
                    </td>
                    <td className='w-[65%] max-[399px]:w-full py-3.5 px-4 sm:px-6 font-medium text-foreground'>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === 'description' && product.description ? (
          <div className='prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line leading-relaxed text-sm md:text-base'>
            {product.description}
          </div>
        ) : null}

        {activeTab === 'shop' ? (
          <div className='grid gap-6 md:grid-cols-2 items-start'>
            <div className='space-y-4'>
              <div>
                <h3 className='text-base sm:text-lg font-bold text-foreground'>{storeName}</h3>
                <p className='text-xs text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1 mt-0.5'>
                  <Icons.circleCheck className='h-3.5 w-3.5' />
                  {t('verifiedShop')}
                </p>
              </div>

              {location ? (
                <div className='flex items-start gap-2.5 text-sm text-foreground/80'>
                  <Icons.mapPin className='h-4 w-4 shrink-0 text-muted-foreground mt-0.5' />
                  <span className='break-words'>{location}</span>
                </div>
              ) : null}

              {contactNumber ? (
                <div className='flex items-center gap-2.5 text-sm text-foreground/80'>
                  <Icons.phone className='h-4 w-4 shrink-0 text-muted-foreground' />
                  <a
                    href={`tel:${contactNumber}`}
                    className='hover:underline font-mono text-sm'
                    dir='ltr'
                  >
                    {formatPhone(contactNumber)}
                  </a>
                </div>
              ) : null}

              {store.openingHours ? (
                <div className='flex items-center gap-2.5 text-sm text-foreground/80'>
                  <Icons.clock className='h-4 w-4 shrink-0 text-muted-foreground' />
                  <span>{store.openingHours}</span>
                </div>
              ) : null}
            </div>

            <div className='flex flex-col justify-start gap-3 rounded-2xl bg-muted/20 p-4 sm:p-5 border border-border/60'>
              <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
                {store.description ||
                  'Visit this store to inspect devices in person, buy accessories, or get warranty assistance.'}
              </p>
              <div className='flex flex-wrap gap-2 pt-2'>
                <Link
                  href={`/shop/${slug}`}
                  className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-primary-foreground transition-all hover:opacity-90 min-h-[44px]'
                >
                  <Icons.store className='h-4 w-4' />
                  <span>{t('visitShop')}</span>
                </Link>
                {store.googleMapsUrl ? (
                  <a
                    href={store.googleMapsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-muted transition-colors min-h-[44px]'
                  >
                    <Icons.externalLink className='h-4 w-4' />
                    <span>{tStores('openInGoogleMaps')}</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className='md:hidden divide-y divide-border/60'>
        <div>
          <button
            type='button'
            onClick={() => toggleMobile('specs')}
            className='flex min-h-[48px] w-full items-center justify-between p-4 text-start font-bold text-foreground focus:outline-none'
          >
            <div className='flex items-center gap-2'>
              <Icons.tag className='h-4 w-4 text-emerald-600' />
              <span className='text-sm'>{t('tabSpecs')}</span>
              <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-semibold'>
                {specRows.length}
              </span>
            </div>
            <Icons.chevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform duration-200',
                mobileExpanded.specs ? 'rotate-180' : ''
              )}
            />
          </button>
          {mobileExpanded.specs ? (
            <div className='p-3 sm:p-4 pt-0'>
              <div className='overflow-hidden rounded-xl border border-border/70'>
                <table className='w-full text-xs'>
                  <tbody>
                    {specRows.map((row, index) => (
                      <tr
                        key={`m-${row.label}`}
                        className={cn(
                          'border-b border-border/50 last:border-b-0 max-[399px]:flex max-[399px]:flex-col',
                          index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent'
                        )}
                      >
                        <td className='py-2.5 px-3 font-semibold text-muted-foreground w-[35%] max-[399px]:w-full'>
                          {row.label}
                        </td>
                        <td className='py-2.5 px-3 font-medium text-foreground w-[65%] max-[399px]:w-full'>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        {product.description ? (
          <div>
            <button
              type='button'
              onClick={() => toggleMobile('description')}
              className='flex min-h-[48px] w-full items-center justify-between p-4 text-start font-bold text-foreground focus:outline-none'
            >
              <div className='flex items-center gap-2'>
                <Icons.info className='h-4 w-4 text-emerald-600' />
                <span className='text-sm'>{t('tabDescription')}</span>
              </div>
              <Icons.chevronDown
                className={cn(
                  'h-5 w-5 text-muted-foreground transition-transform duration-200',
                  mobileExpanded.description ? 'rotate-180' : ''
                )}
              />
            </button>
            {mobileExpanded.description ? (
              <div className='p-4 pt-0 text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>
            ) : null}
          </div>
        ) : null}

        <div>
          <button
            type='button'
            onClick={() => toggleMobile('shop')}
            className='flex min-h-[48px] w-full items-center justify-between p-4 text-start font-bold text-foreground focus:outline-none'
          >
            <div className='flex items-center gap-2'>
              <Icons.store className='h-4 w-4 text-emerald-600' />
              <span className='text-sm'>{t('tabShopInfo')}</span>
            </div>
            <Icons.chevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform duration-200',
                mobileExpanded.shop ? 'rotate-180' : ''
              )}
            />
          </button>
          {mobileExpanded.shop ? (
            <div className='p-4 pt-0 space-y-3 text-xs sm:text-sm'>
              <div className='flex items-center justify-between'>
                <span className='font-bold text-foreground text-sm'>{storeName}</span>
                <Link
                  href={`/shop/${slug}`}
                  className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline min-h-[44px] inline-flex items-center'
                >
                  {t('visitShop')}
                </Link>
              </div>
              {location ? (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Icons.mapPin className='h-4 w-4 shrink-0' />
                  <span className='break-words'>{location}</span>
                </div>
              ) : null}
              {contactNumber ? (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Icons.phone className='h-4 w-4 shrink-0' />
                  <a href={`tel:${contactNumber}`} dir='ltr' className='font-mono'>
                    {formatPhone(contactNumber)}
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
