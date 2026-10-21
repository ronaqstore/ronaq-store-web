import { getTranslations } from 'next-intl/server';
import { Icons } from '@/components/icons';
import { StoreCard } from './store-card';
import type { StoreDiscoveryResultsProps } from '@/types/store';

export async function StoreDiscoveryResults({ stores }: StoreDiscoveryResultsProps) {
  const t = await getTranslations();

  if (stores.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center space-y-3 rounded-2xl border border-dashed border-border p-8'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
          <Icons.store className='h-6 w-6' />
        </div>
        <h3 className='font-semibold text-foreground text-base'>{t('stores.noShopsFound')}</h3>
        <p className='text-xs text-muted-foreground'>{t('stores.shopsFound', { count: 0 })}</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <p className='text-xs text-muted-foreground'>{t('stores.shopsFound', { count: stores.length })}</p>
      <div className='grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4'>

        {stores.map((store, index) => (
          <StoreCard
            key={store.slug || store.id || `store-${index}`}
            store={store}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}
