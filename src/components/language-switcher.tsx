'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: 'en' | 'ur' | 'ps') => {
    const query: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      query[key] = value;
    });
    if (Object.keys(query).length > 0) {
      router.replace({ pathname, query }, { locale: newLocale });
    } else {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <div className='flex items-center gap-1 border border-border rounded-lg p-0.5 text-xs'>
      <Button
        type='button'
        variant={currentLocale === 'en' ? 'secondary' : 'ghost'}
        size='sm'
        className='h-7 px-2 text-xs'
        onClick={() => handleSwitch('en')}
      >
        EN
      </Button>
      <Button
        type='button'
        variant={currentLocale === 'ur' ? 'secondary' : 'ghost'}
        size='sm'
        className='h-7 px-2 text-xs font-urdu'
        onClick={() => handleSwitch('ur')}
      >
        اردو
      </Button>
      <Button
        type='button'
        variant={currentLocale === 'ps' ? 'secondary' : 'ghost'}
        size='sm'
        className='h-7 px-2 text-xs font-pashto'
        onClick={() => handleSwitch('ps')}
      >
        پښتو
      </Button>
    </div>
  );
}
