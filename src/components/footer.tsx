import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import {
  ADMIN_BASE_URL,
  SOCIAL_URLS,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL
} from '@/constants/api';

const SOCIAL_LINKS = [
  {
    key: 'youtube',
    href: SOCIAL_URLS.youtube,
    icon: Icons.youtube,
    labelKey: 'aria.youtube'
  },
  {
    key: 'instagram',
    href: SOCIAL_URLS.instagram,
    icon: Icons.instagram,
    labelKey: 'aria.instagram'
  },
  {
    key: 'tiktok',
    href: SOCIAL_URLS.tiktok,
    icon: Icons.tiktok,
    labelKey: 'aria.tiktok'
  },
  {
    key: 'facebook',
    href: SOCIAL_URLS.facebook,
    icon: Icons.facebook,
    labelKey: 'aria.facebook'
  }
] as const;

export function Footer() {
  const t = useTranslations();

  return (
    <footer className='border-t border-border bg-card/60 backdrop-blur-sm mt-16 sm:mt-24 text-card-foreground pb-[env(safe-area-inset-bottom)]'>
      <div className='mx-auto max-w-[1600px] px-3 min-[390px]:px-4 py-10 sm:px-6 sm:py-12 lg:px-8'>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12'>
          <div className='md:col-span-2 space-y-4'>
            <Link href='/' className='inline-flex items-center gap-2.5 group'>
              <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105'>
                <Icons.store className='h-5 w-5' />
              </div>
              <span className='text-xl font-bold tracking-tight text-foreground'>
                {t('common.appName')}
              </span>
            </Link>

            <p className='text-sm text-muted-foreground max-w-sm leading-relaxed'>
              {t('footer.tagline')}
            </p>

            <div className='pt-2 flex items-center gap-2'>
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={t(item.labelKey)}
                    className='flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-200'
                  >
                    <IconComponent className='h-4 w-4' />
                  </a>
                );
              })}
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='text-sm font-semibold tracking-wider text-foreground uppercase'>
              {t('footer.ownersTitle')}
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <a
                  href={`${ADMIN_BASE_URL}/login`}
                  target='_blank'
                  rel='noopener noreferrer nofollow'
                  className='text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5'
                >
                  <Icons.arrowRight className='h-3.5 w-3.5 text-muted-foreground/70 shrink-0' />
                  {t('footer.login')}
                </a>
              </li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h3 className='text-sm font-semibold tracking-wider text-foreground uppercase'>
              {t('footer.helpTitle')}
            </h3>
            <ul className='space-y-2.5 text-sm'>
              <li>
                <a
                  href={SOCIAL_URLS.whatsappSupport}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={t('aria.whatsapp')}
                  className='text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2'
                >
                  <Icons.whatsapp className='h-4 w-4 text-emerald-500 shrink-0' />
                  {t('footer.whatsappSupport')}
                </a>
              </li>
              <li>
                <a
                  href={SUPPORT_PHONE_TEL}
                  aria-label={t('aria.call')}
                  className='text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2'
                >
                  <Icons.phone className='h-4 w-4 text-primary shrink-0' />
                  <span>{SUPPORT_PHONE}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <Icons.shieldCheck className='h-4 w-4 text-primary' />
            <span>{t('footer.verifiedBadge')}</span>
          </div>

          <p className='text-center sm:text-end'>
            &copy; 2026 {t('common.appName')}. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
