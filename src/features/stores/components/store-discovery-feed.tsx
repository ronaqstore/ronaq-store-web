'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatNumber } from '@/lib/formatters';
import { Icons } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import { STORES_PAGE_SIZE } from '@/constants/site';
import { publicApiRequest } from '@/lib/api/client';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import { mapStoresResponse } from '@/lib/api/mappers';
import type { ApiPaginatedStores } from '@/types/api';
import type { StoreDiscoveryFeedProps, StoreListItem } from '@/types/store';
import { StoreCard } from './store-card';

async function fetchStoresPage(searchQuery: string, cityId: string, page: number) {
  const params = new URLSearchParams();
  if (searchQuery) params.set('q', searchQuery);
  const city = marketplaceCityQueryParam(cityId);
  if (city) params.set('city', city);
  params.set('page', String(page));
  params.set('limit', String(STORES_PAGE_SIZE));
  const raw = await publicApiRequest<ApiPaginatedStores>(`stores?${params.toString()}`, {
    cache: 'no-store'
  });
  return mapStoresResponse(raw);
}

export function StoreDiscoveryFeed({
  initialStores,
  total,
  page: initialPage,
  totalPages,
  searchQuery,
  cityId
}: StoreDiscoveryFeedProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [stores, setStores] = useState<StoreListItem[]>(initialStores);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setStores(initialStores);
    setPage(initialPage);
    setHasMore(initialPage < totalPages);
    setLoadError(false);
    loadingRef.current = false;
  }, [initialStores, initialPage, totalPages, searchQuery, cityId]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError(false);

    const nextPage = page + 1;
    const response = await fetchStoresPage(searchQuery, cityId, nextPage);

    if (!response) {
      setLoadError(true);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    setStores((prev) => {
      const seen = new Set(prev.map((s) => s.slug || s.id));
      const appended = response.items.filter((s) => !seen.has(s.slug || s.id));
      return [...prev, ...appended];
    });
    setPage(response.page);
    setHasMore(response.page < response.totalPages);
    setLoading(false);
    loadingRef.current = false;
  }, [cityId, hasMore, page, searchQuery]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleRetryLoadMore = () => {
    loadingRef.current = false;
    void loadMore();
  };

  if (stores.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-border p-8 py-16 text-center'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
          <Icons.store className='h-6 w-6' />
        </div>
        <h3 className='text-base font-semibold text-foreground'>{t('stores.noShopsInCity')}</h3>
        <p className='text-xs text-muted-foreground'>
          {t('stores.shopsFound', { count: formatNumber(0, locale) })}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground md:text-sm'>
        {t('stores.shopsFound', { count: formatNumber(total, locale) })}
      </p>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4'>
        {stores.map((store, index) => (
          <StoreCard
            key={store.slug || store.id || `store-${index}`}
            store={store}
            priority={index < 2}
          />
        ))}
      </div>

      <div ref={sentinelRef} className='flex min-h-10 flex-col items-center justify-center gap-2 py-6'>
        {loading ? (
          <div className='flex items-center gap-2 text-sm text-muted-foreground' aria-live='polite'>
            <Spinner className='size-4' />
            <span>{t('stores.loadingMore')}</span>
          </div>
        ) : null}
        {loadError ? (
          <button
            type='button'
            className='cursor-pointer text-sm text-primary underline-offset-4 hover:underline'
            onClick={handleRetryLoadMore}
          >
            {t('stores.retryLoadMore')}
          </button>
        ) : null}
        {!hasMore && !loading ? (
          <p className='text-xs text-muted-foreground'>{t('stores.endOfList')}</p>
        ) : null}
      </div>
    </div>
  );
}
