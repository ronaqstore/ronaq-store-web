'use client';

import { useRouter } from 'next/navigation';
import { NotFoundView } from '@/components/common/not-found-view';

export default function RootNotFound() {
  const router = useRouter();

  return (
    <html lang='en'>
      <body className='min-h-dvh bg-background text-foreground antialiased'>
        <NotFoundView
          onBack={() => router.back()}
          onHome={() => router.push('/')}
        />
      </body>
    </html>
  );
}
