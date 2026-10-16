'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      aria-label={t('aria.toggleTheme')}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='w-9 h-9 relative'
    >
      <Icons.sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Icons.moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>{t('aria.toggleTheme')}</span>
    </Button>
  );
}
