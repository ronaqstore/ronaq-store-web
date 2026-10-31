'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { InstallAppButton } from '@/components/pwa/install-app-button';
import { ADMIN_BASE_URL } from '@/constants/api';
import { CITY_PREFERENCE_COOKIE } from '@/constants/city-preference';
import { cn } from '@/lib/utils';

const navLinkClass =
  'rounded-lg px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2';

export function Navbar() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const shopsActive = pathname === '/shops' || pathname.startsWith('/shops/');
  const homeActive = pathname === '/' || pathname === '';

  useEffect(() => {
    const updateCity = () => {
      if (typeof document === 'undefined') return;
      const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${CITY_PREFERENCE_COOKIE}=`));
      const val = match?.split('=')[1];
      if (val && val !== 'all' && !val.startsWith('area:')) {
        setCurrentCity(decodeURIComponent(val));
      } else {
        setCurrentCity(null);
      }
    };
    updateCity();
    window.addEventListener('city-changed', updateCity);
    return () => window.removeEventListener('city-changed', updateCity);
  }, []);

  const handleOpenCity = () => {
    window.dispatchEvent(new CustomEvent('open-city-picker'));
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((open) => !open);
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl'>
      <div className='mx-auto flex h-14 max-w-7xl 2xl:max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-6 lg:gap-8'>
          <Link href='/' className='group flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105'>
              <Icons.store className='h-5 w-5' />
            </div>
            <span className='text-lg font-bold tracking-tight text-foreground'>
              {t('common.appName')}
            </span>
          </Link>

          <nav className='hidden items-center gap-4 text-sm font-medium md:flex [@media(display-mode:standalone)]:hidden'>
            <Link
              href='/'
              aria-current={homeActive ? 'page' : undefined}
              className={cn(
                navLinkClass,
                homeActive && 'bg-primary/10 font-semibold text-primary'
              )}
            >
              {t('nav.home')}
            </Link>
            <Link
              href='/shops'
              aria-current={shopsActive ? 'page' : undefined}
              className={cn(
                navLinkClass,
                shopsActive && 'bg-primary/10 font-semibold text-primary'
              )}
            >
              {t('nav.stores')}
            </Link>
          </nav>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <button
            type='button'
            onClick={handleOpenCity}
            className='inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors active:scale-95'
          >
            <Icons.mapPin className='h-3.5 w-3.5 text-primary shrink-0' />
            <span className='truncate max-w-[100px]'>
              {currentCity ? currentCity.replace(/^[a-z]/, (c) => c.toUpperCase()) : t('common.city')}
            </span>
          </button>

          <ThemeToggle />

          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={toggleMobile}
            aria-label={t('aria.toggleNavigation')}
            className='h-9 w-9 rounded-full'
          >
            {mobileOpen ? <Icons.close className='h-5 w-5' /> : <Icons.menu className='h-5 w-5' />}
          </Button>
        </div>

        <div className='hidden items-center gap-2 md:flex'>
          <LanguageSwitcher />
          <div className='[@media(display-mode:standalone)]:hidden'>
            <InstallAppButton />
          </div>
          <ThemeToggle />
          <a
            href={`${ADMIN_BASE_URL}/login`}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className={cn(buttonVariants({ size: 'sm' }), 'ms-1 shadow-sm rounded-xl')}
          >
            {t('nav.login')}
          </a>
        </div>
      </div>

      {mobileOpen ? (
        <div className='animate-in slide-in-from-top-2 space-y-4 border-b border-border bg-background px-4 py-4 md:hidden'>
          <div className='flex flex-col space-y-3 text-sm font-medium'>
            <Link
              href='/'
              onClick={closeMobile}
              aria-current={homeActive ? 'page' : undefined}
              className={cn(
                'rounded-lg px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
                homeActive ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'
              )}
            >
              {t('nav.home')}
            </Link>
            <Link
              href='/shops'
              onClick={closeMobile}
              aria-current={shopsActive ? 'page' : undefined}
              className={cn(
                'rounded-lg px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
                shopsActive ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'
              )}
            >
              {t('nav.stores')}
            </Link>
          </div>
          <div className='flex items-center justify-between border-t border-border pt-3'>
            <LanguageSwitcher />
            <div className='[@media(display-mode:standalone)]:hidden'>
              <InstallAppButton />
            </div>
          </div>
          <a
            href={`${ADMIN_BASE_URL}/login`}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className={cn(buttonVariants(), 'w-full rounded-xl')}
          >
            {t('nav.login')}
          </a>
        </div>
      ) : null}
    </header>
  );
}
