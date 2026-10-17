'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { StockBadgeProps } from '@/types/product';

export function StockBadge({ availability, stockCount }: StockBadgeProps) {
  const t = useTranslations('catalog');

  if (availability === 'OUT_OF_STOCK') {
    return (
      <Badge variant='destructive' className='text-[10px]'>
        {t('outOfStock')}
      </Badge>
    );
  }

  if (availability === 'LOW_STOCK') {
    return (
      <Badge
        variant='outline'
        className='border-amber-500/40 bg-background/90 text-[10px] text-amber-700 backdrop-blur-md dark:text-amber-300'
      >
        {stockCount != null ? t('lowStockCount', { count: stockCount }) : t('lowStock')}
      </Badge>
    );
  }

  return (
    <Badge
      variant='outline'
      className='border-emerald-500/30 bg-background/90 text-[10px] text-emerald-600 backdrop-blur-md dark:text-emerald-400'
    >
      {stockCount != null ? t('inStockCount', { count: stockCount }) : t('inStock')}
    </Badge>
  );
}
