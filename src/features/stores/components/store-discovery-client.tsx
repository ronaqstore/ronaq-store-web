'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { StoreHero } from './store-hero';
import { StoreCard } from './store-card';
import type { StoreDiscoveryClientProps } from '@/types/store';

export function StoreDiscoveryClient({ initialStores }: StoreDiscoveryClientProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    return initialStores.filter((store) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = store.displayName.toLowerCase().includes(query);
        const matchesCity = store.city.toLowerCase().includes(query);
        const matchesAddress = store.address?.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesAddress) {
          return false;
        }
      }
      return true;
    });
  }, [initialStores, searchQuery]);

  return (
    <div>
      <StoreHero
        initialSearch={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>
              {t('stores.allShops')}
            </h2>
            <p className='text-xs text-muted-foreground mt-0.5'>
              {t('stores.shopsFound', { count: filteredStores.length })}
            </p>
          </div>
        </div>

        {filteredStores.length === 0 ? (
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
            {filteredStores.map((store, index) => (
              <StoreCard key={store.slug || store.id || `store-${index}`} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
