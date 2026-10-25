'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { CITY_PREFERENCE_ALL } from '@/constants/city-preference';
import { writeCityPreferenceCookie } from '@/lib/city-preference';
import {
  getMarketplaceHubsPage,
  resolveNearestHub
} from '@/features/marketplace/api/service';
import type { CityPreferenceGateProps, MarketplaceHub } from '@/types/marketplace';
import { cn } from '@/lib/utils';

const HUBS_PAGE_SIZE = 20;
const SKELETON_ROWS = 6;

function CityListSkeleton() {
  return (
    <div className='space-y-2' aria-busy='true' aria-live='polite'>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <Skeleton key={index} className='h-12 w-full rounded-2xl' />
      ))}
    </div>
  );
}

export function CityPreferenceGate({
  initialCityId,
  hasPreference,
  open,
  onOpenChange
}: CityPreferenceGateProps) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (!initialCityId || initialCityId === CITY_PREFERENCE_ALL) return CITY_PREFERENCE_ALL;
    if (initialCityId.startsWith('area:')) return CITY_PREFERENCE_ALL;
    return initialCityId;
  });
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [hubs, setHubs] = useState<MarketplaceHub[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [canScrollMore, setCanScrollMore] = useState(false);
  const loadingRef = useRef(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const updateScrollHint = useCallback(() => {
    const el = listRef.current;
    if (!el) {
      setCanScrollMore(false);
      return;
    }
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    setCanScrollMore(remaining > 12);
  }, []);

  useEffect(() => {
    if (!initialCityId || initialCityId === CITY_PREFERENCE_ALL || initialCityId.startsWith('area:')) {
      setSelectedId(CITY_PREFERENCE_ALL);
      return;
    }
    setSelectedId(initialCityId);
  }, [initialCityId]);

  useEffect(() => {
    if (!hasPreference && !open) {
      onOpenChange(true);
    }
  }, [hasPreference, open, onOpenChange]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(citySearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [citySearch]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    loadingRef.current = true;
    setLoading(true);
    setHubs([]);
    setPage(1);
    setHasMore(false);
    setCanScrollMore(false);

    void getMarketplaceHubsPage({
      page: 1,
      limit: HUBS_PAGE_SIZE,
      q: debouncedSearch || undefined
    }).then((result) => {
      if (cancelled) return;
      setHubs(result.items);
      setPage(result.page);
      setHasMore(result.page < result.totalPages);
      setLoading(false);
      loadingRef.current = false;
    });

    return () => {
      cancelled = true;
      loadingRef.current = false;
    };
  }, [open, debouncedSearch]);

  useEffect(() => {
    updateScrollHint();
  }, [hubs, loading, loadingMore, hasMore, updateScrollHint]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || !open) return;
    loadingRef.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await getMarketplaceHubsPage({
      page: nextPage,
      limit: HUBS_PAGE_SIZE,
      q: debouncedSearch || undefined
    });
    setHubs((prev) => {
      const seen = new Set(prev.map((hub) => hub.id));
      return [...prev, ...result.items.filter((hub) => !seen.has(hub.id))];
    });
    setPage(result.page);
    setHasMore(result.page < result.totalPages);
    setLoadingMore(false);
    loadingRef.current = false;
  }, [debouncedSearch, hasMore, open, page]);

  const onListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    setCanScrollMore(remaining > 12);
    if (remaining < 48) void loadMore();
  };

  const persistAndClose = (cityId: string) => {
    writeCityPreferenceCookie(cityId);
    onOpenChange(false);
    setCitySearch('');
    setDebouncedSearch('');
    router.refresh();
  };

  const handleContinue = () => {
    persistAndClose(selectedId || CITY_PREFERENCE_ALL);
  };

  const handleDismiss = () => {
    persistAndClose(selectedId || CITY_PREFERENCE_ALL);
  };

  const handleAllCities = () => {
    setSelectedId(CITY_PREFERENCE_ALL);
    persistAndClose(CITY_PREFERENCE_ALL);
  };

  const handleSelectHub = (hub: MarketplaceHub) => {
    setSelectedId(hub.id);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocateError(true);
      return;
    }
    setLocating(true);
    setLocateError(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const hub = await resolveNearestHub(
            position.coords.latitude,
            position.coords.longitude
          );
          if (!hub?.id) {
            setLocateError(true);
            setLocating(false);
            return;
          }
          setSelectedId(hub.id);
          persistAndClose(hub.id);
        } catch {
          setLocateError(true);
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocateError(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 }
    );
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4'>
      <button
        type='button'
        className='absolute inset-0 bg-background/80 backdrop-blur-sm'
        aria-label={t('common.close')}
        onClick={handleDismiss}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='city-gate-title'
        className='relative flex flex-col w-full max-h-[90dvh] rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl sm:max-h-[85vh] sm:max-w-md sm:rounded-3xl sm:border sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]'
      >
        <div className='mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/30 mb-2 sm:hidden' />

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={handleDismiss}
          className='absolute inset-e-3 top-3 z-10 h-9 w-9 rounded-full p-0 text-muted-foreground hover:text-foreground'
          aria-label={t('common.close')}
        >
          <Icons.close className='h-4 w-4' />
        </Button>

        <div className='space-y-1 pe-8 shrink-0'>
          <h2 id='city-gate-title' className='text-lg sm:text-xl font-bold tracking-tight text-foreground'>
            {t('marketplace.cityGateTitle')}
          </h2>
          <p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
            {t('marketplace.cityGateSubtitle')}
          </p>
        </div>

        <div className='relative mt-3 shrink-0'>
          <Icons.search className='pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='search'
            value={citySearch}
            onChange={(event) => setCitySearch(event.target.value)}
            placeholder={t('marketplace.searchCity')}
            className='h-12 w-full rounded-2xl border border-border bg-background pe-4 ps-10 text-base outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary'
            autoComplete='off'
          />
        </div>

        <div className='relative mt-3 flex-1 min-h-0'>
          <div
            ref={listRef}
            className='h-full max-h-64 sm:max-h-72 space-y-1.5 overflow-y-auto pe-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            onScroll={onListScroll}
          >
            {loading ? <CityListSkeleton /> : null}

            {!loading ? (
              <>
                {!debouncedSearch ? (
                  <button
                    type='button'
                    onClick={handleAllCities}
                    className={cn(
                      'flex min-h-[48px] w-full items-center justify-between rounded-xl border px-4 py-3 text-start text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      selectedId === CITY_PREFERENCE_ALL
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border/80 bg-background hover:bg-muted/60'
                    )}
                  >
                    <span>{t('marketplace.allCities')}</span>
                    {selectedId === CITY_PREFERENCE_ALL ? (
                      <Icons.check className='h-4 w-4 text-primary' />
                    ) : null}
                  </button>
                ) : null}
                {hubs.map((hub) => (
                  <button
                    key={hub.id}
                    type='button'
                    onClick={() => handleSelectHub(hub)}
                    className={cn(
                      'flex min-h-[48px] w-full items-center justify-between rounded-xl border px-4 py-3 text-start text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      selectedId === hub.id
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border/80 bg-background hover:bg-muted/60'
                    )}
                  >
                    <span>{hub.name}</span>
                    {selectedId === hub.id ? <Icons.check className='h-4 w-4 text-primary' /> : null}
                  </button>
                ))}
                {hubs.length === 0 ? (
                  <p className='px-1 py-6 text-center text-sm text-muted-foreground'>
                    {t('marketplace.noCityMatch')}
                  </p>
                ) : null}
              </>
            ) : null}

            {loadingMore ? (
              <div className='flex justify-center py-2'>
                <Icons.spinner className='h-4 w-4 animate-spin text-muted-foreground' />
              </div>
            ) : null}
          </div>

          {canScrollMore && !loading ? (
            <div className='pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-card via-card/90 to-transparent pb-1 pt-8'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/95 text-muted-foreground shadow-sm'>
                <Icons.chevronDown className='h-4 w-4 animate-bounce' aria-hidden />
                <span className='sr-only'>{t('marketplace.scrollForMoreCities')}</span>
              </span>
            </div>
          ) : null}
        </div>

        {locateError ? (
          <p className='mt-2 text-xs text-destructive shrink-0'>{t('marketplace.locationFailed')}</p>
        ) : null}

        <div className='mt-4 grid gap-2.5 sm:grid-cols-2 shrink-0'>
          <Button
            type='button'
            variant='outline'
            className='h-12 min-h-[48px] rounded-xl font-bold w-full border-border/80'
            disabled={locating || loading}
            onClick={handleUseLocation}
          >
            {locating ? (
              <Icons.spinner className='me-2 h-4 w-4 animate-spin' />
            ) : (
              <Icons.mapPin className='me-2 h-4 w-4' />
            )}
            {t('marketplace.useMyLocation')}
          </Button>
          <Button
            type='button'
            className='h-12 min-h-[48px] rounded-xl font-bold w-full shadow-sm'
            disabled={loading}
            onClick={handleContinue}
          >
            {t('marketplace.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}
