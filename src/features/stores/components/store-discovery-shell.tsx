'use client';

import { useEffect, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
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
        router.replace({ pathname, query: { q: trimmed } }, { scroll: false });
      } else {
        router.replace(pathname, { scroll: false });
      }
    });
  }, [debouncedSearch, urlSearch, pathname, router]);

  return (
    <div>
      <StoreHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <section
        id='shops'
        className='mx-auto max-w-[1600px] scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8'
      >
        <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
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
