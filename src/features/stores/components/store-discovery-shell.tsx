'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { StoreHero } from './store-hero';
import type { StoreDiscoveryShellProps } from '@/types/store';

export function StoreDiscoveryShell({ searchQuery: urlSearch, children }: StoreDiscoveryShellProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed === urlSearch) return;

    startTransition(() => {
      if (trimmed) {
        router.replace({ pathname, query: { q: trimmed } });
      } else {
        router.replace(pathname);
      }
    });
  }, [debouncedSearch, urlSearch, pathname, router]);

  return (
    <div>
      <StoreHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 space-y-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight text-foreground'>
            {t('stores.allShops')}
          </h2>
          <p className='text-xs text-muted-foreground mt-0.5 inline-flex items-center gap-2 min-h-4'>
            {isPending ? (
              <>
                <Spinner className='size-3.5 text-primary' />
                {t('common.loading')}
              </>
            ) : null}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
