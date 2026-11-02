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
        'pb-[max(1rem,env(safe-area-inset-bottom))] select-none [-webkit-tap-highlight-color:transparent]',
        className
      )}
    >
      <div className='flex h-14 sm:h-16 items-center justify-around px-1 sm:px-2'>
        <Link
          href='/'
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 sm:gap-1 py-1 transition-colors min-h-[44px] sm:min-h-[48px] select-none outline-none focus:outline-none focus-visible:outline-none',
            isHome ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-full transition-colors',
              isHome ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
            )}
          >
            <Icons.home className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
          <span className='text-[10px] sm:text-xs font-medium leading-none truncate whitespace-nowrap max-w-full px-0.5'>{t('home')}</span>
        </Link>

        <Link
          href='/shops'
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 sm:gap-1 py-1 transition-colors min-h-[44px] sm:min-h-[48px] select-none outline-none focus:outline-none focus-visible:outline-none',
            isShops ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div
            className={cn(
              'flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-full transition-colors',
              isShops ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
            )}
          >
            <Icons.store className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
          <span className='text-[10px] sm:text-xs font-medium leading-none truncate whitespace-nowrap max-w-full px-0.5'>{t('stores')}</span>
        </Link>

        <button
          type='button'
          onClick={handleSearchClick}
          className='flex flex-1 flex-col items-center justify-center gap-0.5 sm:gap-1 py-1 transition-colors min-h-[44px] sm:min-h-[48px] text-muted-foreground hover:text-foreground select-none outline-none focus:outline-none focus-visible:outline-none'
        >
          <div className='flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-full transition-colors'>
            <Icons.search className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
          <span className='text-[10px] sm:text-xs font-medium leading-none truncate whitespace-nowrap max-w-full px-0.5'>{t('search')}</span>
        </button>

        <a
          href={`${ADMIN_BASE_URL}/login`}
          target='_blank'
          rel='noopener noreferrer nofollow'
          className='flex flex-1 flex-col items-center justify-center gap-0.5 sm:gap-1 py-1 transition-colors min-h-[44px] sm:min-h-[48px] text-muted-foreground hover:text-foreground select-none outline-none focus:outline-none focus-visible:outline-none'
        >
          <div className='flex h-6 w-10 sm:h-7 sm:w-12 items-center justify-center rounded-full transition-colors'>
            <Icons.user className='h-4 w-4 sm:h-5 sm:w-5' />
          </div>
          <span className='text-[10px] sm:text-xs font-medium leading-none truncate whitespace-nowrap max-w-full px-0.5'>{t('account')}</span>
        </a>
      </div>
    </nav>
  );
}
