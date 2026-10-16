import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-4'>
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
        <Icons.info className='h-8 w-8' />
      </div>
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>
        {t('stores.noShopsFound')}
      </h2>
      <Link href='/'>
        <Button type='button' className='gap-2'>
          <Icons.arrowLeft className='h-4 w-4' />
          {t('nav.home')}
        </Button>
      </Link>
    </div>
  );
}
