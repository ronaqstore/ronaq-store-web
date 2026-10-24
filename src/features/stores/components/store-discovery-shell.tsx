'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { CityPreferenceGate } from '@/components/city/city-preference-gate';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedUrlSearch } from '@/hooks/use-debounced-url-search';
import { CITY_PREFERENCE_ALL } from '@/constants/city-preference';
import { StoreHero } from './store-hero';
import { StoreSearchBar } from './store-search-bar';
import type { StoreDiscoveryShellProps } from '@/types/store';

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
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    shouldSyncUrl,
    markUrlSync
  } = useDebouncedUrlSearch(urlSearch, 400);

  const isAllCities = cityId === CITY_PREFERENCE_ALL || cityId.startsWith('area:');
  const selectedHubName = isAllCities
    ? t('marketplace.allCities')
    : (selectedCityName ?? t('marketplace.allCities'));

  useEffect(() => {
    if (!hasCityPreference) setCityGateOpen(true);
  }, [hasCityPreference]);

  useEffect(() => {
    if (!shouldSyncUrl) return;
    markUrlSync(debouncedQuery);
    startTransition(() => {
      if (debouncedQuery) {
        router.replace({ pathname, query: { q: debouncedQuery } }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  }, [debouncedQuery, shouldSyncUrl, pathname, router, markUrlSync]);

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

      <div className='sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl min-[390px]:top-16'>
        <div className='mx-auto flex max-w-[1600px] flex-col gap-2.5 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-3.5 lg:px-8'>
          <div className='min-w-0 flex-1'>
            <StoreSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <Button
            type='button'
            variant='outline'
            className='min-h-10 w-full justify-start sm:max-w-52 sm:w-auto'
            onClick={handleChangeCity}
          >
            <Icons.mapPin className='me-2 h-4 w-4 shrink-0' />
            <span className='truncate'>{selectedHubName}</span>
          </Button>
        </div>
      </div>

      <section
        id='shops'
        className='mx-auto max-w-[1600px] scroll-mt-36 px-4 py-10 sm:px-6 sm:py-14 lg:px-8'
      >
        <div className='mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl'>
              {t('stores.allShops')}
            </h2>
            <p className='mt-1 max-w-xl text-sm text-muted-foreground'>
              {t('stores.sectionSubtitle')}
            </p>
          </div>
          <div className='inline-flex min-h-5 items-center gap-2' aria-busy={isPending}>
            {isPending ? (
              <>
                <Skeleton className='h-3 w-16' />
                <Skeleton className='h-3 w-10' />
              </>
            ) : null}
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
