'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedUrlSearch } from '@/hooks/use-debounced-url-search';
import { CITY_PREFERENCE_ALL } from '@/constants/city-preference';
import {
  countActiveMarketplaceFilters,
  marketplaceFiltersToQuery,
  MARKETPLACE_SEARCH_MAX_LEN,
  sanitizeMarketplaceText
} from '@/lib/marketplace-filters';
import { cn } from '@/lib/utils';
import { CityPreferenceGate } from '@/components/city/city-preference-gate';
import { MarketplaceFilterSidebar } from './marketplace-filter-sidebar';
import { MarketplaceSearchBar } from './marketplace-search-bar';
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
  const [isPending, startTransition] = useTransition();
  const [cityGateOpen, setCityGateOpen] = useState(!hasCityPreference);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<MarketplaceListingFilters>(filters);
  const {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    shouldSyncUrl,
    markUrlSync
  } = useDebouncedUrlSearch(urlSearch, 400);

  const activeFilterCount = countActiveMarketplaceFilters(filters);
  const draftFilterCount = countActiveMarketplaceFilters(draftFilters);

  useEffect(() => {
    if (!hasCityPreference) setCityGateOpen(true);
  }, [hasCityPreference]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  useEffect(() => {
    if (modelKey) return;
    if (!shouldSyncUrl) return;
    markUrlSync(debouncedQuery);
    startTransition(() => {
      const query = buildHomeQuery({
        q: debouncedQuery || undefined,
        cityId,
        filters
      });
      if (Object.keys(query).length > 0) {
        router.replace({ pathname, query }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  }, [
    debouncedQuery,
    shouldSyncUrl,
    pathname,
    router,
    cityId,
    markUrlSync,
    modelKey,
    filters
  ]);

  const isAllCities = cityId === CITY_PREFERENCE_ALL || cityId.startsWith('area:');
  const selectedHubName = isAllCities
    ? t('marketplace.allCities')
    : (selectedCityName ?? t('marketplace.allCities'));

  const navigateHome = (next: MarketplaceNavigateHomeInput) => {
    const query = buildHomeQuery({
      q: next.q,
      modelKey: next.modelKey,
      cityId,
      filters: next.filters ?? filters
    });
    markUrlSync(next.q ?? '');
    startTransition(() => {
      if (Object.keys(query).length > 0) {
        router.replace({ pathname, query }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  };

  const handleChangeCity = () => {
    setCityGateOpen(true);
  };

  const handleSelectModel = (model: MarketplaceModelSuggestion) => {
    const title = sanitizeMarketplaceText(model.title);
    const key = sanitizeMarketplaceText(model.modelKey, 160);
    setSearchQuery(title);
    navigateHome({ q: title || undefined, modelKey: key || null });
  };

  const handleSearchAll = (query: string) => {
    const safe = sanitizeMarketplaceText(query);
    setSearchQuery(safe);
    navigateHome({ q: safe || undefined, modelKey: null });
  };

  const handleClearModel = () => {
    const safe = sanitizeMarketplaceText(searchQuery);
    navigateHome({ q: safe || undefined, modelKey: null });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value.slice(0, MARKETPLACE_SEARCH_MAX_LEN));
  };

  const handleOpenFilters = () => {
    setDraftFilters(filters);
    setFiltersOpen(true);
  };

  const handleDraftFiltersChange = (next: MarketplaceListingFilters) => {
    setDraftFilters(next);
  };

  const applyFiltersAndClose = (nextFilters: MarketplaceListingFilters) => {
    const q = searchQuery.trim() || undefined;
    const query: Record<string, string> = {
      ...buildHomeQuery({
        q,
        modelKey,
        cityId,
        filters: nextFilters
      }),
      rf: String(Date.now())
    };
    markUrlSync(q ?? '');
    setDraftFilters(nextFilters);
    setFiltersOpen(false);
    startTransition(() => {
      router.replace({ pathname, query }, { scroll: false });
      router.refresh();
    });
  };

  const handleClearFilters = () => {
    applyFiltersAndClose({ sort: filters.sort });
  };

  const handleShowFilterResults = () => {
    applyFiltersAndClose(draftFilters);
  };

  const heading = modelKey
    ? t('marketplace.modelResultsHeading', {
        model: searchQuery || t('marketplace.productsHeading')
      })
    : t('marketplace.productsHeading');

  const subtitle = modelKey
    ? t('marketplace.modelResultsSubtitle', { city: selectedHubName })
    : t('marketplace.productsSubtitle', { city: selectedHubName });

  return (
    <div className='pb-[env(safe-area-inset-bottom)]'>
      <CityPreferenceGate
        initialCityId={isAllCities ? null : cityId}
        hasPreference={hasCityPreference}
        open={cityGateOpen}
        onOpenChange={setCityGateOpen}
      />

      <section className='border-b border-border/60 bg-gradient-to-b from-primary/10 to-background'>
        <div className='mx-auto max-w-[1600px] px-3 py-5 sm:px-6 sm:py-7 lg:px-8'>
          <h1 className='max-w-3xl text-xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl'>
            {t('marketplace.heroTitle')}
          </h1>
          <p className='mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base'>
            {t('marketplace.heroSubtitle')}
          </p>
        </div>
      </section>

      <div className='sticky top-14 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl min-[390px]:top-16'>
        <div className='mx-auto flex max-w-[1600px] flex-col gap-2.5 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-3 lg:px-8'>
          <div className='min-w-0 flex-1'>
            <MarketplaceSearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              cityId={cityId}
              modelKey={modelKey}
              onSelectModel={handleSelectModel}
              onSearchAll={handleSearchAll}
              onClearModel={handleClearModel}
            />
          </div>
          <div className='flex shrink-0 gap-2'>
            <Button
              type='button'
              variant='outline'
              className='min-h-10 flex-1 justify-start sm:max-w-52 sm:flex-none'
              onClick={handleChangeCity}
            >
              <Icons.mapPin className='me-2 h-4 w-4 shrink-0' />
              <span className='truncate'>{selectedHubName}</span>
            </Button>
            <Button
              type='button'
              variant={activeFilterCount > 0 ? 'default' : 'outline'}
              className='relative min-h-10 shrink-0'
              onClick={handleOpenFilters}
            >
              <Icons.filter className='me-2 h-4 w-4' />
              {t('marketplace.filtersHeading')}
              {activeFilterCount > 0 ? (
                <span className='ms-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] font-bold'>
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>
      </div>

      <section className='mx-auto max-w-[1600px] px-3 py-5 sm:px-6 sm:py-8 lg:px-8'>
        <div className='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between'>
          <div className='min-w-0'>
            <h2 className='text-lg font-bold tracking-tight text-foreground sm:text-2xl'>
              {heading}
            </h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>{subtitle}</p>
          </div>
          <div className='inline-flex items-center' aria-busy={isPending}>
            {isPending ? (
              <Skeleton className='h-10 w-28 rounded-xl' />
            ) : (
              <Link
                href='/shops'
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'min-h-10 rounded-xl px-4'
                )}
              >
                {t('nav.stores')}
              </Link>
            )}
          </div>
        </div>
        {children}
      </section>

      {filtersOpen ? (
        <div className='fixed inset-0 z-50' role='presentation'>
          <button
            type='button'
            aria-label={t('common.close')}
            className='absolute inset-0 bg-black/40 backdrop-blur-[2px]'
            onClick={() => setFiltersOpen(false)}
          />
          <div
            role='dialog'
            aria-modal='true'
            aria-label={t('marketplace.filtersHeading')}
            className={cn(
              'absolute flex w-full flex-col bg-background shadow-2xl',
              'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl border border-border',
              'pb-[max(0.75rem,env(safe-area-inset-bottom))]',
              'sm:inset-y-0 sm:inset-s-0 sm:inset-e-auto sm:max-h-none sm:w-[min(100%,22.5rem)] sm:rounded-none sm:border-y-0 sm:border-s-0 sm:pb-0'
            )}
          >
            <div className='relative flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5'>
              <div
                aria-hidden
                className='absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-muted-foreground/30 sm:hidden'
              />
              <div className='flex items-center gap-2 pt-1 sm:pt-0'>
                <Icons.filter className='h-4 w-4 text-primary' />
                <p className='text-base font-semibold'>{t('marketplace.filtersHeading')}</p>
                {draftFilterCount > 0 ? (
                  <span className='rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary'>
                    {draftFilterCount}
                  </span>
                ) : null}
              </div>
              <div className='flex items-center gap-1'>
                {draftFilterCount > 0 ? (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='h-9 px-2 text-xs'
                    onClick={handleClearFilters}
                  >
                    {t('marketplace.clearFilters')}
                  </Button>
                ) : null}
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-9 w-9 rounded-full p-0'
                  aria-label={t('common.close')}
                  onClick={() => setFiltersOpen(false)}
                >
                  <Icons.close className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-2 [scrollbar-width:thin]'>
              <MarketplaceFilterSidebar
                filters={draftFilters}
                onChange={handleDraftFiltersChange}
                showHeader={false}
                className='border-0 bg-transparent p-1 shadow-none'
              />
            </div>

            <div className='shrink-0 border-t border-border px-4 py-3'>
              <Button
                type='button'
                className='min-h-11 w-full'
                onClick={handleShowFilterResults}
              >
                {t('marketplace.showResults')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
