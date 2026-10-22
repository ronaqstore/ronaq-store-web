'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';

const REFRESH_COOLDOWN_MS = 750;

export function LiveDataRefresh() {
  const router = useRouter();
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      if (now - lastRefreshAtRef.current < REFRESH_COOLDOWN_MS) return;
      lastRefreshAtRef.current = now;
      router.refresh();
    };

    const handleFocus = () => {
      refreshIfVisible();
    };

    const handleVisibility = () => {
      refreshIfVisible();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [router]);

  return null;
}
