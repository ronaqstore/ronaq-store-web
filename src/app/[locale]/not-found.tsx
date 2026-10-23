import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-5'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
        <Icons.info className='h-8 w-8' />
      </div>
      <div className='space-y-2 max-w-md'>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          {t('errors.notFoundTitle')}
        </h1>
        <p className='text-sm text-muted-foreground'>{t('errors.notFoundDescription')}</p>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Link href='/' className={cn(buttonVariants(), 'gap-2')}>
          <Icons.arrowLeft className='h-4 w-4' />
          {t('errors.backHome')}
        </Link>
        <a href='#shops' className={buttonVariants({ variant: 'outline' })}>
          {t('nav.stores')}
        </a>
      </div>
    </div>
  );
}
