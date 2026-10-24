'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useTopLoader } from 'nextjs-toploader';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { CITY_PREFERENCE_ALL } from '@/constants/city-preference';
import {
  commitMarketplaceSearchQuery,
  countActiveMarketplaceFilters,
  listingQueryRecordsEqual,
  marketplaceFiltersToQuery,
  sanitizeMarketplaceText,
  stableListingQueryKey
} from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import { CityPreferenceGate } from '@/components/city/city-preference-gate';
import { FilterSheet } from './filter-sheet';
import { MarketplaceSearchBar } from './marketplace-search-bar';
import { QuickFilterChips } from './quick-filter-chips';
import { ActiveFilterChips } from './active-filter-chips';
import { MarketplaceSortDropdown } from './marketplace-sort-dropdown';
import type {
  MarketplaceHomeQueryInput,
  MarketplaceListingFilters,
  MarketplaceModelSuggestion,
  MarketplaceNavigateHomeInput,
  MarketplaceShellProps
} from '@/types/marketplace';

function buildHomeQuery(opts: MarketplaceHomeQueryInput): Record<string, string> {
  const query: Record<string, string> = {
    ...marketplaceFiltersToQuery(opts.filters ?? {})
  };
  if (opts.modelKey) query.model = opts.modelKey;
  if (opts.q) query.q = opts.q;
  if (opts.cityId && opts.cityId !== CITY_PREFERENCE_ALL && !opts.cityId.startsWith('area:')) {
    query.city = opts.cityId;
  }
  return query;
}

export function MarketplaceShell({
  searchQuery: urlSearch,
  modelKey,
  cityId,
  selectedCityName,
  hasCityPreference,
  filters,
  children
}: MarketplaceShellProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const topLoader = useTopLoader();
  const topLoaderRef = useRef(topLoader);
  const [isPending, startTransition] = useTransition();
  const [cityGateOpen, setCityGateOpen] = useState(!hasCityPreference);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    topLoaderRef.current = topLoader;
  }, [topLoader]);
  const chipDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNavigatedKeyRef = useRef(
    stableListingQueryKey(
      buildHomeQuery({ q: urlSearch || undefined, modelKey, cityId, filters })
    )
  );

  const cancelChipDebounce = useCallback(() => {
    if (chipDebounceRef.current) {
      clearTimeout(chipDebounceRef.current);
      chipDebounceRef.current = null;
    }
  }, []);

  const activeFilterCount = countActiveMarketplaceFilters(filters);
  const committedSearch = urlSearch;

  useEffect(() => {
    if (!hasCityPreference) setCityGateOpen(true);
  }, [hasCityPreference]);

  useEffect(() => {
    if (isPending) {
      topLoaderRef.current.start();
      return () => {
        topLoaderRef.current.done();
      };
    }
    topLoaderRef.current.done();
  }, [isPending]);

  useEffect(() => {
    const handleOpenCity = () => setCityGateOpen(true);
    window.addEventListener('open-city-picker', handleOpenCity);
    return () => window.removeEventListener('open-city-picker', handleOpenCity);
  }, []);

  useEffect(() => {
    lastNavigatedKeyRef.current = stableListingQueryKey(
      buildHomeQuery({
        q: urlSearch || undefined,
        modelKey,
        cityId,
        filters
      })
    );
  }, [urlSearch, modelKey, cityId, filters]);

  useEffect(() => {
    return () => {
      cancelChipDebounce();
    };
  }, [cancelChipDebounce]);

  const navigateHome = useCallback(
    (
      next: MarketplaceNavigateHomeInput,
      mode: 'replace' | 'push' = 'replace'
    ) => {
      const query = buildHomeQuery({
        q: next.q,
        modelKey: next.modelKey,
        cityId,
        filters: next.filters ?? filters
      });
      const key = stableListingQueryKey(query);
      if (key === lastNavigatedKeyRef.current) return;
      lastNavigatedKeyRef.current = key;

      startTransition(() => {
        const navigate = mode === 'push' ? router.push : router.replace;
        if (Object.keys(query).length > 0) {
          navigate({ pathname, query }, { scroll: false });
        } else {
          navigate(pathname, { scroll: false });
        }
      });
    },
    [cityId, filters, pathname, router]
  );

  const isAllCities = cityId === CITY_PREFERENCE_ALL || cityId.startsWith('area:');
  const selectedHubName = isAllCities
    ? t('marketplace.allCities')
    : (selectedCityName ?? t('marketplace.allCities'));

  const handleChangeCity = () => {
    setCityGateOpen(true);
  };

  const handleSelectModel = useCallback(
    (model: MarketplaceModelSuggestion) => {
      const title = sanitizeMarketplaceText(model.title);
      const key = sanitizeMarketplaceText(model.modelKey, 160);
      navigateHome({ q: title || undefined, modelKey: key || null }, 'replace');
    },
    [navigateHome]
  );

  const handleCommitSearch = useCallback(
    (query: string) => {
      const safe = commitMarketplaceSearchQuery(query);
      if (safe == null) return;
      navigateHome({ q: safe || undefined, modelKey: null }, 'replace');
    },
    [navigateHome]
  );

  const handleClearSearch = useCallback(() => {
    navigateHome({ q: undefined, modelKey: null }, 'replace');
  }, [navigateHome]);

  const handleOpenFilters = () => {
    setFiltersOpen(true);
  };

  const applyFilters = useCallback(
    (nextFilters: MarketplaceListingFilters, mode: 'replace' | 'push' = 'push') => {
      cancelChipDebounce();
      const q = committedSearch || undefined;
      const nextQuery = buildHomeQuery({
        q,
        modelKey,
        cityId,
        filters: nextFilters
      });
      const currentQuery = buildHomeQuery({
        q,
        modelKey,
        cityId,
        filters
      });
      if (listingQueryRecordsEqual(nextQuery, currentQuery)) return;
      navigateHome(
        {
          q,
          modelKey,
          filters: nextFilters
        },
        mode
      );
    },
    [cancelChipDebounce, cityId, committedSearch, filters, modelKey, navigateHome]
  );

  const handleApplyFilters = useCallback(
    (nextFilters: MarketplaceListingFilters) => {
      applyFilters(nextFilters, 'push');
    },
    [applyFilters]
  );

  const handleQuickFilterChange = useCallback(
    (nextFilters: MarketplaceListingFilters) => {
      cancelChipDebounce();
      chipDebounceRef.current = setTimeout(() => {
        chipDebounceRef.current = null;
        applyFilters(nextFilters, 'push');
      }, 150);
    },
    [applyFilters, cancelChipDebounce]
  );

  const handleClearAll = useCallback(() => {
    cancelChipDebounce();
    navigateHome(
      {
        q: undefined,
        modelKey: null,
        filters: { sort: filters.sort }
      },
      'push'
    );
  }, [cancelChipDebounce, filters.sort, navigateHome]);

  const handleSortChange = useCallback(
    (sortValue: 'newest' | 'price_asc' | 'price_desc') => {
      applyFilters(
        {
          ...filters,
          sort: sortValue === 'newest' ? undefined : sortValue
        },
        'push'
      );
    },
    [applyFilters, filters]
  );

  const heading = modelKey
    ? t('marketplace.modelResultsHeading', {
        model: committedSearch || t('marketplace.productsHeading')
      })
    : t('marketplace.productsHeading');

  const subtitle = modelKey
    ? t('marketplace.modelResultsSubtitle', { city: selectedHubName })
    : t('marketplace.productsSubtitle', { city: selectedHubName });

  return (
    <div className='min-w-0'>
      <CityPreferenceGate
        initialCityId={isAllCities ? null : cityId}
        hasPreference={hasCityPreference}
        open={cityGateOpen}
        onOpenChange={setCityGateOpen}
      />

      <FilterSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      <section className='border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-background py-6 sm:py-8 md:py-10 lg:py-12'>
        <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl 2xl:text-5xl mb-2'>
            {t('marketplace.heroTitle')}
          </h1>
          <p className='text-sm text-muted-foreground sm:text-base lg:text-lg hidden min-[360px]:block max-w-2xl leading-relaxed'>
            {t('marketplace.heroSubtitle')}
          </p>
        </div>
      </section>

      <div className='sticky top-14 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl'>
        <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2.5'>
          <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
            <div className='min-w-0 flex-1 max-w-2xl'>
              <MarketplaceSearchBar
                committedQuery={committedSearch}
                cityId={cityId}
                modelKey={modelKey}
                onCommitSearch={handleCommitSearch}
                onSelectModel={handleSelectModel}
                onClearSearch={handleClearSearch}
              />
            </div>

            <div className='flex shrink-0 items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                className='h-12 min-h-[48px] rounded-xl flex-1 justify-start border-border/80 px-3.5 md:flex-none md:max-w-48'
                onClick={handleChangeCity}
              >
                <Icons.mapPin className='me-2 h-4 w-4 shrink-0 text-primary' />
                <span className='truncate text-sm font-semibold'>{selectedHubName}</span>
              </Button>

              <Button
                type='button'
                variant={activeFilterCount > 0 ? 'default' : 'outline'}
                className={cn(
                  'relative h-12 min-h-[48px] rounded-xl shrink-0 px-4 font-semibold',
                  activeFilterCount === 0 && 'border-border/80'
                )}
                onClick={handleOpenFilters}
              >
                <Icons.filter className='me-2 h-4 w-4' />
                <span className='text-sm'>{t('marketplace.filtersHeading')}</span>
                {activeFilterCount > 0 ? (
                  <span className='ms-1.5 rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground'>
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>

              <MarketplaceSortDropdown
                value={filters.sort ?? 'newest'}
                onChange={handleSortChange}
                className='hidden sm:block'
              />
            </div>
          </div>

          <QuickFilterChips
            filters={filters}
            onChange={handleQuickFilterChange}
            onOpenFilters={handleOpenFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      <section className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10'>
        <div className='mb-4 sm:mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-4'>
          <div className='min-w-0'>
            <h2 className='text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl 2xl:text-3xl'>
              {heading}
            </h2>
            <p className='mt-0.5 text-xs sm:text-sm text-muted-foreground'>{subtitle}</p>
          </div>
          <div className='inline-flex items-center shrink-0' aria-busy={isPending}>
            {isPending ? (
              <Skeleton className='h-10 w-28 rounded-xl' />
            ) : (
              <Link
                href='/shops'
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'min-h-[44px] rounded-xl px-4 text-sm font-semibold border-border/80 shadow-xs'
                )}
              >
                {t('nav.stores')}
              </Link>
            )}
          </div>
        </div>

        <ActiveFilterChips
          filters={filters}
          searchQuery={committedSearch}
          modelKey={modelKey}
          onChange={handleApplyFilters}
          onClearSearch={handleClearSearch}
          onClearAll={handleClearAll}
          className='mb-4'
        />

        <div
          className={cn(
            'transition-opacity duration-150',
            isPending && 'opacity-60'
          )}
          aria-busy={isPending}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
