'use client';

import { ErrorView } from '@/components/common/error-view';
import type { LocaleAppErrorProps } from '@/types/common';

export default function GlobalError({ error, reset }: LocaleAppErrorProps) {
  return (
    <html lang='en'>
      <body className='bg-background text-foreground font-sans'>
        <ErrorView error={error} reset={reset} />
      </body>
    </html>
  );
}
