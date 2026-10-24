'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { isIosInstallCandidate, isStandaloneDisplay } from '@/lib/pwa';
import { cn } from '@/lib/utils';
import type { BeforeInstallPromptEvent, InstallPromptProps } from '@/types/marketplace';

const DISMISS_KEY = 'ronaq-web-pwa-dismissed-at';
const DISMISS_DAYS = 14;

function readDismissed(): boolean {
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
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    return;
  }
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const t = useTranslations('pwa');
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneDisplay() || readDismissed()) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    if (isIosInstallCandidate()) {
      setIos(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    markDismissed();
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === 'accepted') {
      setVisible(false);
      return;
    }
    dismiss();
  };

  const handleInstallClick = () => {
    void install();
  };

  return (
    <div
      className={cn(
        'fixed inset-x-3 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card p-3 shadow-xl sm:inset-x-auto sm:inset-e-4 sm:bottom-4',
        'bottom-[max(0.75rem,env(safe-area-inset-bottom))]',
        className
      )}
      role='dialog'
      aria-label={t('installTitle')}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          <Icons.mobile className='h-5 w-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-sm font-semibold text-foreground'>{t('installTitle')}</p>
          <p className='mt-0.5 text-xs text-muted-foreground'>
            {ios ? t('installIosHint') : t('installBody')}
          </p>
          <div className='mt-2.5 flex flex-wrap gap-2'>
            {!ios && deferred ? (
              <Button type='button' size='sm' className='min-h-9' onClick={handleInstallClick}>
                {t('installCta')}
              </Button>
            ) : null}
            <Button type='button' size='sm' variant='ghost' className='min-h-9' onClick={dismiss}>
              {t('dismiss')}
            </Button>
          </div>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='h-8 w-8 shrink-0 rounded-full p-0'
          aria-label={t('dismiss')}
          onClick={dismiss}
        >
          <Icons.close className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
