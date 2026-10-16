'use client';

import { staticT } from '@/i18n/static-t';
import { Button } from '@/components/ui/button';
import type { LocaleAppErrorProps } from '@/types/common';

export function ErrorView({ reset }: LocaleAppErrorProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-4'>
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>
        {staticT('errors.errorTitle')}
      </h2>
      <Button type='button' onClick={reset} variant='default'>
        {staticT('errors.retry')}
      </Button>
    </div>
  );
}
