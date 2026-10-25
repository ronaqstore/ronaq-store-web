'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { EmptyStateProps } from '@/types/marketplace';

export function EmptyState({
  title,
  description,
  onAction,
  actionLabel,
  className
}: EmptyStateProps) {
  const t = useTranslations('marketplace');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/50 p-8 py-16 text-center',
        className
      )}
    >
      <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-4 shadow-xs'>
        <Icons.mobile className='h-7 w-7' />
      </div>
      <h3 className='text-base font-bold text-foreground sm:text-lg'>
        {title ?? t('emptyStateTitle')}
      </h3>
      <p className='mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm leading-relaxed'>
        {description ?? t('emptyStateDesc')}
      </p>
      {onAction ? (
        <Button
          type='button'
          variant='outline'
          className='mt-5 min-h-[44px] rounded-xl px-5 text-sm font-semibold'
          onClick={onAction}
        >
          {actionLabel ?? t('clearFilters')}
        </Button>
      ) : null}
    </div>
  );
}
