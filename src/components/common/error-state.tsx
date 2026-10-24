'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ErrorStateProps } from '@/types/marketplace';

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  className
}: ErrorStateProps) {
  const t = useTranslations('marketplace');
  const tCommon = useTranslations('common');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 py-16 text-center',
        className
      )}
    >
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4 shadow-xs'>
        <Icons.warning className='h-7 w-7' />
      </div>
      <h3 className='text-base font-bold text-foreground sm:text-lg'>
        {title ?? t('errorStateTitle')}
      </h3>
      <p className='mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm leading-relaxed'>
        {description ?? t('errorStateDesc')}
      </p>
      {onRetry ? (
        <Button
          type='button'
          variant='outline'
          className='mt-5 min-h-[44px] rounded-xl px-5 text-sm font-semibold border-destructive/30 hover:bg-destructive/10'
          onClick={onRetry}
        >
          {retryLabel ?? tCommon('retry')}
        </Button>
      ) : null}
    </div>
  );
}
