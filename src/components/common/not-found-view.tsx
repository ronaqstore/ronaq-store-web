'use client';

import { staticT } from '@/i18n/static-t';
import { Button } from '@/components/ui/button';
import type { NotFoundViewProps } from '@/types/common';

export function NotFoundView({ onBack, onHome }: NotFoundViewProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6 text-center space-y-4'>
      <span className='from-foreground bg-gradient-to-b to-transparent bg-clip-text text-8xl font-black text-transparent'>
        404
      </span>
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>
        {staticT('errors.notFoundTitle')}
      </h2>
      <p className='text-muted-foreground text-sm max-w-md'>
        {staticT('errors.notFoundDescription')}
      </p>
      <div className='flex items-center gap-3 pt-2'>
        <Button type='button' onClick={onBack} variant='outline'>
          {staticT('errors.goBack')}
        </Button>
        <Button type='button' onClick={onHome} variant='default'>
          {staticT('errors.backHome')}
        </Button>
      </div>
    </div>
  );
}
