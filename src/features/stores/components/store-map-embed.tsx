'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  buildMapEmbedSrc,
  distanceKm,
  formatDistanceKm,
  hasStoreCoords
} from '@/lib/geo';
import type { StoreMapEmbedProps } from '@/types/store';

export function StoreMapEmbed({
  store,
  className,
  heightClassName = 'h-[min(70vw,22rem)] sm:h-[26rem] md:h-[28rem]'
}: StoreMapEmbedProps) {
  const t = useTranslations('stores');
  const [distanceLabel, setDistanceLabel] = useState<string | null>(null);

  const ready = hasStoreCoords(store);

  useEffect(() => {
    if (!ready || !navigator.geolocation) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        const km = distanceKm(
          pos.coords.latitude,
          pos.coords.longitude,
          store.latitude,
          store.longitude
        );
        setDistanceLabel(formatDistanceKm(km));
      },
      () => {
        if (!cancelled) setDistanceLabel(null);
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 8_000 }
    );
    return () => {
      cancelled = true;
    };
  }, [ready, store.latitude, store.longitude]);

  if (!ready) return null;

  const title = store.displayName || store.name || t('mapTitle');
  const addressLine = store.address
    ? `${store.address}${store.city ? `, ${store.city}` : ''}`
    : store.city || null;
  return (
    <section
      className={cn('overflow-hidden rounded-2xl border border-border/70 bg-card', className)}
      aria-label={t('mapTitle')}
    >
      <div className='flex flex-wrap items-start justify-between gap-2 border-b border-border/60 px-4 py-3'>
        <div className='min-w-0 space-y-0.5'>
          <p className='flex items-center gap-1.5 text-sm font-semibold text-foreground'>
            <Icons.mapPin className='h-4 w-4 shrink-0 text-primary' />
            {t('mapTitle')}
          </p>
          {addressLine ? (
            <p className='text-xs leading-relaxed text-muted-foreground'>{addressLine}</p>
          ) : null}
        </div>
        {distanceLabel ? (
          <p className='rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'>
            {t('distanceAway', { distance: distanceLabel })}
          </p>
        ) : null}
      </div>
      <div className={cn('relative w-full bg-muted', heightClassName)}>
        <iframe
          title={t('mapFrameTitle', { store: title })}
          src={buildMapEmbedSrc(store.latitude, store.longitude)}
          className='absolute inset-0 h-full w-full border-0'
          loading='lazy'
          referrerPolicy='strict-origin-when-cross-origin'
          allowFullScreen
        />
      </div>
    </section>
  );
}
