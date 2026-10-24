'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ADMIN_BASE_URL } from '@/constants/api';
import { cn } from '@/lib/utils';

export function Navbar() {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((open) => !open);
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border/60 bg-background/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl'>
      <div className='mx-auto flex h-14 max-w-[1600px] items-center justify-between px-3 min-[390px]:h-16 min-[390px]:px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='group flex items-center gap-2.5'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105'>
              <Icons.store className='h-5 w-5' />
            </div>
            <span className='text-lg font-bold tracking-tight text-foreground'>
              {t('common.appName')}
            </span>
          </Link>

          <nav className='hidden items-center gap-6 text-sm font-medium md:flex'>
            <Link
              href='/'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              {t('nav.home')}
            </Link>
            <Link
              href='/shops'
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              {t('nav.stores')}
            </Link>
          </nav>
        </div>

        <div className='hidden items-center gap-2 md:flex'>
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href={`${ADMIN_BASE_URL}/login`}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className={cn(buttonVariants({ size: 'sm' }), 'ms-1 shadow-sm')}
          >
            {t('nav.login')}
          </a>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={toggleMobile}
            aria-label={t('aria.toggleNavigation')}
          >
            {mobileOpen ? <Icons.close className='h-5 w-5' /> : <Icons.menu className='h-5 w-5' />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className='animate-in slide-in-from-top-2 space-y-4 border-b border-border bg-background px-4 py-4 md:hidden'>
          <div className='flex flex-col space-y-3 text-sm font-medium'>
            <Link href='/' onClick={closeMobile} className='py-1 text-foreground'>
              {t('nav.home')}
            </Link>
            <Link href='/shops' onClick={closeMobile} className='py-1 text-foreground'>
              {t('nav.stores')}
            </Link>
          </div>
          <div className='flex items-center justify-between border-t border-border pt-3'>
            <LanguageSwitcher />
          </div>
          <a
            href={`${ADMIN_BASE_URL}/login`}
            target='_blank'
            rel='noopener noreferrer nofollow'
            className={cn(buttonVariants(), 'w-full')}
          >
            {t('nav.login')}
          </a>
        </div>
      ) : null}
    </header>
  );
}
