'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Spinner } from '@/components/ui/spinner';
import { StoreHero } from './store-hero';
import { StoreCard } from './store-card';
import { getPublicStores } from '@/features/stores/api/service';
import type { StoreDiscoveryClientProps } from '@/types/store';
import type { StoreListItem } from '@/types/store';

export function StoreDiscoveryClient({ initialStores }: StoreDiscoveryClientProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stores, setStores] = useState(initialStores);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    if (!debouncedSearch) {
      setStores(initialStores);
      return;
    }

    setIsLoading(true);
    void getPublicStores({ q: debouncedSearch, limit: 50 }).then((response) => {
      if (cancelled) return;
      setStores(response?.items ?? []);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, initialStores]);

  return (
    <div>
      <StoreHero initialSearch={searchQuery} onSearchChange={setSearchQuery} />

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
              {t('stores.allShops')}
            </h2>
            <p className='text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-2'>
              {isLoading ? (
                <>
                  <Spinner className='size-3.5 text-primary' />
                  {t('common.loading')}
                </>
              ) : (
                t('stores.shopsFound', { count: stores.length })
              )}
            </p>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-2xl border border-dashed border-border p-8'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
              <Icons.store className='h-6 w-6' />
            </div>
            <h3 className='font-semibold text-foreground text-base'>
              {t('stores.noShopsFound')}
            </h3>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {stores.map((store: StoreListItem, index) => (
              <StoreCard key={store.slug || store.id || `store-${index}`} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
