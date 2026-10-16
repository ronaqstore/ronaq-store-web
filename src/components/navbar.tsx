'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ADMIN_BASE_URL } from '@/constants/api';

export function Navbar() {
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className='sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md'>
      <div className='mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='flex items-center gap-2.5 group'>
            <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105'>
              <Icons.store className='h-5 w-5' />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-bold tracking-tight text-foreground'>
                {t('common.appName')}
              </span>
            </div>
          </Link>

          <nav className='hidden md:flex items-center gap-5 text-sm font-medium'>
            <Link
              href='/'
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              {t('nav.home')}
            </Link>
          </nav>
        </div>

        <div className='hidden md:flex items-center gap-3'>
          <LanguageSwitcher />
          <ThemeToggle />

          <a
            href={`${ADMIN_BASE_URL}/login`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button type='button' size='sm' className='shadow-sm'>
              {t('nav.login')}
            </Button>
          </a>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t('aria.toggleNavigation')}
          >
            {mobileOpen ? <Icons.close className='h-5 w-5' /> : <Icons.menu className='h-5 w-5' />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className='border-b border-border bg-background px-4 py-4 md:hidden space-y-4 animate-in slide-in-from-top-2'>
          <div className='flex flex-col space-y-3 text-sm font-medium'>
            <Link
              href='/'
              onClick={() => setMobileOpen(false)}
              className='text-foreground py-1'
            >
              {t('nav.home')}
            </Link>
          </div>

          <div className='pt-2 border-t border-border flex items-center justify-between'>
            <LanguageSwitcher />
          </div>

          <div className='pt-2 flex flex-col gap-2'>
            <a
              href={`${ADMIN_BASE_URL}/login`}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full'
            >
              <Button type='button' className='w-full'>
                {t('nav.login')}
              </Button>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
