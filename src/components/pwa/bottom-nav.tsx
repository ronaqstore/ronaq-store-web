'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Link, usePathname } from '@/i18n/navigation';
import { ADMIN_BASE_URL } from '@/constants/api';
import { cn } from '@/lib/utils';
import type { BottomNavProps } from '@/types/marketplace';

export function BottomNav({ className }: BottomNavProps) {
  const t = useTranslations('nav');
  const tAria = useTranslations('aria');
  const pathname = usePathname();

  const isHome = pathname === '/' || pathname === '';
  const isShops = pathname.startsWith('/shops');

  const handleSearchClick = () => {
    const input = document.getElementById('marketplace-search-input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <nav
      aria-label={tAria('bottomNav')}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-lg md:hidden',
        'pb-[env(safe-area-inset-bottom)] select-none [-webkit-tap-highlight-color:transparent]',
        className
      )}
    >
      <div className='flex h-16 items-center justify-around px-2'>
        <Link
          href='/'
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[48px]',
            isHome ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
              isHome ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
            )}
          >
            <Icons.home className='h-5 w-5' />
          </div>
          <span className='text-xs font-medium leading-none'>{t('home')}</span>
        </Link>

        <Link
          href='/shops'
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[48px]',
            isShops ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'flex h-7 w-12 items-center justify-center rounded-full transition-colors',
              isShops ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
            )}
          >
            <Icons.store className='h-5 w-5' />
          </div>
          <span className='text-xs font-medium leading-none'>{t('stores')}</span>
        </Link>

        <button
          type='button'
          onClick={handleSearchClick}
          className='flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[48px] text-muted-foreground hover:text-foreground'
        >
          <div className='flex h-7 w-12 items-center justify-center rounded-full transition-colors'>
            <Icons.search className='h-5 w-5' />
          </div>
          <span className='text-xs font-medium leading-none'>{t('search')}</span>
        </button>

        <a
          href={`${ADMIN_BASE_URL}/login`}
          target='_blank'
          rel='noopener noreferrer nofollow'
          className='flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[48px] text-muted-foreground hover:text-foreground'
        >
          <div className='flex h-7 w-12 items-center justify-center rounded-full transition-colors'>
            <Icons.user className='h-5 w-5' />
          </div>
          <span className='text-xs font-medium leading-none'>{t('account')}</span>
        </a>
      </div>
    </nav>
  );
}
