'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { OfflineBannerProps } from '@/types/marketplace';

export function OfflineBanner({ className }: OfflineBannerProps) {
  const t = useTranslations('marketplace');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role='status'
      aria-live='polite'
      className={cn(
        'sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all',
        className
      )}
    >
      <Icons.wifiOff className='h-4 w-4 shrink-0' />
      <span>{t('offlineNotice')}</span>
    </div>
  );
}
