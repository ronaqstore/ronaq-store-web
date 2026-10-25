'use client';

import { useCallback, useEffect, useState } from 'react';
import { isIosInstallCandidate, isStandaloneDisplay } from '@/lib/pwa';
import type { BeforeInstallPromptEvent, UsePwaInstallResult } from '@/types/marketplace';

type PwaInstallListener = () => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listening = false;
const listeners = new Set<PwaInstallListener>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function ensureInstallListener(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;

  window.addEventListener('beforeinstallprompt', (event: Event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });
}

export function usePwaInstall(): UsePwaInstallResult {
  const [, setTick] = useState(0);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    ensureInstallListener();
    setStandalone(isStandaloneDisplay());
    setIos(isIosInstallCandidate() && !isStandaloneDisplay());

    const onChange = () => {
      setStandalone(isStandaloneDisplay());
      setTick((value) => value + 1);
    };
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return 'unavailable' as const;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners();
    return choice.outcome === 'accepted' ? ('accepted' as const) : ('dismissed' as const);
  }, []);

  return {
    canPrompt: Boolean(deferredPrompt),
    isStandalone: standalone,
    isIos: ios,
    promptInstall
  };
}
