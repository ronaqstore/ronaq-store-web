'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buildGoogleMapsUrl, hasStoreCoords } from '@/lib/geo';
import type { StoreMapLinkProps } from '@/types/store';

export function StoreMapLink({ store, triggerClassName, children }: StoreMapLinkProps) {
  const t = useTranslations('stores');

  if (!hasStoreCoords(store)) return null;

  return (
    <a
      href={buildGoogleMapsUrl(store.latitude, store.longitude)}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'gap-1.5 text-xs',
        triggerClassName
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children ?? (
        <>
          <Icons.mapPin className='h-3.5 w-3.5' />
          {t('viewMap')}
        </>
      )}
    </a>
  );
}
