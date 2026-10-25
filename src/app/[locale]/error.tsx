'use client';

import { ErrorState } from '@/components/common/error-state';
import type { LocaleAppErrorProps } from '@/types/common';

export default function LocaleError({ reset }: LocaleAppErrorProps) {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-6'>
      <ErrorState onRetry={reset} />
    </div>
  );
}
