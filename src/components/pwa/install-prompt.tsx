'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { readCityPreferenceCookie } from '@/lib/city-preference';
import { cn } from '@/lib/utils';
import type { InstallPromptProps } from '@/types/marketplace';

const DISMISS_KEY = 'ronaq-web-pwa-dismissed-at';
const DISMISS_DAYS = 14;

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    return;
  }
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const t = useTranslations('pwa');
  const { canPrompt, isStandalone, isIos, promptInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  const evaluateVisibility = useCallback(() => {
    if (isStandalone || readDismissed()) {
      setVisible(false);
      return;
    }
    if (!readCityPreferenceCookie()) {
      setVisible(false);
      return;
    }
    const hasOpenDialog = Boolean(
      document.querySelector('[role="dialog"]:not([data-install-prompt="true"])')
    );
    if (hasOpenDialog) {
      setVisible(false);
      return;
    }
    if (canPrompt || isIos) {
      setVisible(true);
    }
  }, [canPrompt, isIos, isStandalone]);

  useEffect(() => {
    if (isStandalone || readDismissed()) {
      setVisible(false);
      return;
    }
    if (!readCityPreferenceCookie()) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      evaluateVisibility();
    }, 4000);

    const onCityChanged = () => {
      window.setTimeout(evaluateVisibility, 1500);
    };

    const onOpenPicker = () => {
      setVisible(false);
    };

    window.addEventListener('city-changed', onCityChanged);
    window.addEventListener('open-city-picker', onOpenPicker);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('city-changed', onCityChanged);
      window.removeEventListener('open-city-picker', onOpenPicker);
    };
  }, [evaluateVisibility, isStandalone]);

  if (!visible || isStandalone) return null;

  const dismiss = () => {
    markDismissed();
    setVisible(false);
  };

  const handleInstallClick = () => {
    void promptInstall().then((outcome) => {
      if (outcome === 'accepted') {
        setVisible(false);
        return;
      }
      if (outcome === 'dismissed') {
        dismiss();
      }
    });
  };

  return (
    <div
      data-install-prompt='true'
      className={cn(
        'fixed inset-x-2.5 z-40 mx-auto max-w-sm sm:max-w-md rounded-2xl border border-border bg-card p-3 shadow-xl sm:inset-x-auto sm:inset-e-4 sm:bottom-4',
        'bottom-[calc(4.75rem+max(0.5rem,env(safe-area-inset-bottom)))]',
        className
      )}
      role='dialog'
      aria-label={t('installTitle')}
    >
      <div className='flex items-start gap-2.5 sm:gap-3'>
        <div className='mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          <Icons.download className='h-4 w-4 sm:h-5 sm:w-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-xs sm:text-sm font-semibold text-foreground'>{t('installTitle')}</p>
          <p className='mt-0.5 text-[11px] sm:text-xs text-muted-foreground leading-snug'>
            {isIos ? t('installIosHint') : t('installBody')}
          </p>
          <div className='mt-2 flex flex-wrap gap-2'>
            {!isIos && canPrompt ? (
              <Button type='button' size='sm' className='h-8 min-h-[32px] px-3 text-xs' onClick={handleInstallClick}>
                {t('installCta')}
              </Button>
            ) : null}
            <Button type='button' size='sm' variant='ghost' className='h-8 min-h-[32px] px-3 text-xs' onClick={dismiss}>
              {t('dismiss')}
            </Button>
          </div>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full p-0 text-muted-foreground hover:text-foreground'
          aria-label={t('dismiss')}
          onClick={dismiss}
        >
          <Icons.close className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        </Button>
      </div>
    </div>
  );
}
