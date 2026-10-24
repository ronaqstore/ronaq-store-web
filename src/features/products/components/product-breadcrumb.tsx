'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import type { ProductBreadcrumbProps } from '@/types/product';

export function ProductBreadcrumb({ crumbs }: ProductBreadcrumbProps) {
  const tAria = useTranslations('aria');

  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label={tAria('breadcrumb')} className='mb-4 lg:mb-6'>
      <ol className='flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs md:text-sm text-muted-foreground'>
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          const isMiddle = idx > 0 && !isLast;

          return (
            <li key={`${crumb.path}-${idx}`} className='inline-flex items-center gap-1.5 min-w-0'>
              {idx > 0 ? (
                <Icons.chevronRight className='h-3 w-3 md:h-3.5 md:w-3.5 shrink-0 opacity-50 rtl:rotate-180' aria-hidden />
              ) : null}
              {isLast ? (
                <span className='font-semibold text-foreground truncate max-w-[140px] sm:max-w-[220px] md:max-w-md'>
                  {crumb.name}
                </span>
              ) : isMiddle ? (
                <Link
                  href={crumb.path}
                  className='transition-colors hover:text-foreground inline-flex items-center'
                >
                  <span className='truncate max-w-[120px] sm:max-w-[180px] max-[479px]:hidden'>
                    {crumb.name}
                  </span>
                  <span className='hidden max-[479px]:inline font-bold'>...</span>
                </Link>
              ) : (
                <Link
                  href={crumb.path}
                  className='transition-colors hover:text-foreground shrink-0'
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
