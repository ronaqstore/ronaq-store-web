'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { LocaleAppErrorProps } from '@/types/common';

export default function ShopError({ reset }: LocaleAppErrorProps) {
  const t = useTranslations();

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-4'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive'>
        <Icons.warning className='h-8 w-8' />
      </div>
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>
        {t('common.error')}
      </h2>
      <Button type='button' onClick={reset} className='gap-2'>
        <Icons.refresh className='h-4 w-4' />
        {t('common.retry')}
      </Button>
    </div>
  );
}
