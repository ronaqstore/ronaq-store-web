'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CityPreferenceGate } from '@/components/city/city-preference-gate';
import { usePathname, useRouter } from '@/i18n/navigation';
import { CITY_PREFERENCE_ALL } from '@/constants/city-preference';
import { StoreHero } from './store-hero';
import { StoreSearchBar } from './store-search-bar';
import type { StoreDiscoveryShellProps, StoreListItem } from '@/types/store';

export function StoreDiscoveryShell({
  searchQuery: urlSearch,
  cityId,
  selectedCityName,
  hasCityPreference,
  children
}: StoreDiscoveryShellProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [cityGateOpen, setCityGateOpen] = useState(!hasCityPreference);

  const isAllCities = cityId === CITY_PREFERENCE_ALL || cityId.startsWith('area:');
  const selectedHubName = isAllCities
    ? t('marketplace.allCities')
    : (selectedCityName ?? t('marketplace.allCities'));

  useEffect(() => {
    if (!hasCityPreference) setCityGateOpen(true);
  }, [hasCityPreference]);

  useEffect(() => {
    const onOpenCity = () => setCityGateOpen(true);
    window.addEventListener('open-city-picker', onOpenCity);
    return () => window.removeEventListener('open-city-picker', onOpenCity);
  }, []);

  const navigateSearch = useCallback(
    (q: string) => {
      startTransition(() => {
        if (q) {
          router.replace({ pathname, query: { q } }, { scroll: false });
        } else {
          router.replace(pathname, { scroll: false });
        }
      });
    },
    [pathname, router]
  );

  const handleCommitSearch = useCallback(
    (q: string) => {
      navigateSearch(q);
    },
    [navigateSearch]
  );

  const handleClearSearch = useCallback(() => {
    navigateSearch('');
  }, [navigateSearch]);

  const handleSelectStore = useCallback(
    (store: StoreListItem) => {
      startTransition(() => {
        router.push(`/shop/${store.slug}`);
      });
    },
    [router]
  );

  const handleChangeCity = () => {
    setCityGateOpen(true);
  };

  return (
    <div>
      <CityPreferenceGate
        initialCityId={isAllCities ? null : cityId}
        hasPreference={hasCityPreference}
        open={cityGateOpen}
        onOpenChange={setCityGateOpen}
      />

      <StoreHero />

      <div className='sticky top-[var(--app-bar-h)] z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl'>
        <div className='mx-auto flex w-full max-w-7xl 2xl:max-w-[1440px] flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8'>
          <div className='min-w-0 w-full sm:max-w-md lg:max-w-lg'>
            <StoreSearchBar
              committedQuery={urlSearch}
              cityId={cityId}
              onCommitSearch={handleCommitSearch}
              onSelectStore={handleSelectStore}
              onClearSearch={handleClearSearch}
            />
          </div>
          <Button
            type='button'
            variant='outline'
            className='h-12 min-h-12 w-full shrink-0 justify-start rounded-xl border-border/80 px-3.5 sm:ms-auto sm:w-auto sm:max-w-52'
            onClick={handleChangeCity}
          >
            <Icons.mapPin className='me-2 h-4 w-4 shrink-0 text-primary' />
            <span className='truncate text-sm font-semibold'>{selectedHubName}</span>
          </Button>
        </div>
        {isPending ? (
          <div className='h-0.5 w-full overflow-hidden bg-muted'>
            <div className='h-full w-1/3 animate-pulse bg-primary' />
          </div>
        ) : null}
      </div>

      <section
        id='shops'
        className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] scroll-mt-36 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14'
      >
        <div className='mb-4 border-b border-border/40 pb-4 sm:mb-6'>
          <h2 className='text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl 2xl:text-3xl'>
            {t('stores.allShops')}
          </h2>
          <p className='mt-0.5 max-w-xl text-xs text-muted-foreground sm:text-sm'>
            {t('stores.sectionSubtitle')}
          </p>
        </div>
        <div className={isPending ? 'opacity-60 transition-opacity' : undefined}>{children}</div>
      </section>
    </div>
  );
}
