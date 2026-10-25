'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { cn } from '@/lib/utils';
import type { InstallAppButtonProps } from '@/types/marketplace';

export function InstallAppButton({ className }: InstallAppButtonProps) {
  const t = useTranslations('pwa');
  const tAria = useTranslations('aria');
  const { canPrompt, isStandalone, isIos, promptInstall } = usePwaInstall();
  const [open, setOpen] = useState(false);

  if (isStandalone) return null;

  const closePanel = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((value) => !value);
  };

  const handleInstall = () => {
    void promptInstall().then((outcome) => {
      if (outcome === 'accepted') {
        setOpen(false);
      }
    });
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        aria-label={tAria('installApp')}
        aria-expanded={open}
        onClick={handleToggle}
        className='relative h-9 w-9'
      >
        <Icons.download className='h-4 w-4' />
        <span className='sr-only'>{tAria('installApp')}</span>
      </Button>

      {open ? (
        <>
          <button
            type='button'
            className='fixed inset-0 z-40 cursor-default'
            aria-label={t('dismiss')}
            onClick={closePanel}
          />
          <div
            role='dialog'
            aria-label={t('installTitle')}
            className='absolute inset-e-0 top-[calc(100%+0.4rem)] z-50 w-[min(18.5rem,calc(100vw-1.5rem))] rounded-2xl border border-border bg-card p-3.5 shadow-xl'
          >
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                <Icons.download className='h-4 w-4' />
              </div>
              <div className='min-w-0 flex-1 space-y-1'>
                <p className='text-sm font-semibold text-foreground'>{t('installTitle')}</p>
                <p className='text-xs text-muted-foreground'>
                  {isIos ? t('installIosHint') : t('installBody')}
                </p>
              </div>
            </div>
            <div className='mt-3 flex flex-wrap gap-2'>
              {canPrompt && !isIos ? (
                <Button type='button' size='sm' className='min-h-9' onClick={handleInstall}>
                  {t('installCta')}
                </Button>
              ) : null}
              <Button type='button' size='sm' variant='ghost' className='min-h-9' onClick={closePanel}>
                {t('dismiss')}
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
