import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import type { BreadcrumbsProps } from '@/types/seo';

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations('aria');

  if (items.length === 0) return null;

  return (
    <nav aria-label={t('breadcrumb')} className='mb-4'>
      <ol className='flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className='inline-flex items-center gap-1.5'>
              {index > 0 ? (
                <Icons.chevronRight className='h-3.5 w-3.5 shrink-0 opacity-60' aria-hidden />
              ) : null}
              {isLast ? (
                <span aria-current='page' className='font-medium text-foreground line-clamp-1'>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className='transition-colors hover:text-foreground line-clamp-1'
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
