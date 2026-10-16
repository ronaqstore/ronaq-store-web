import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import { isLocale, isRtlLocale, locales, type AppLocale } from '@/i18n/request';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/i18n-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import type { LocaleLayoutProps } from '@/types/common';
import {
  APP_DESCRIPTION,
  APP_NAME,
  PWA_THEME_COLOR_DARK,
  PWA_THEME_COLOR_LIGHT
} from '@/constants/site';
import '@/styles/globals.css';


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  adjustFontFallback: true
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: `${APP_NAME} — Discover Verified Local Mobile Shops`,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/placeholders/shop-logo.svg',
    apple: '/placeholders/shop-logo.svg'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: PWA_THEME_COLOR_LIGHT },
    { media: '(prefers-color-scheme: dark)', color: PWA_THEME_COLOR_DARK }
  ]
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRtl = isRtlLocale(locale as AppLocale);

  return (
    <html
      lang={locale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={poppins.variable}
      suppressHydrationWarning
    >
      <body
        className={`${poppins.className} min-h-dvh bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary flex flex-col justify-between overscroll-none`}
        suppressHydrationWarning
      >
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <ThemeProvider>
          <I18nProvider locale={locale} messages={messages}>
            <Navbar />
            <main className='flex-1 min-w-0'>{children}</main>
            <Footer />
          </I18nProvider>


        </ThemeProvider>
      </body>
    </html>
  );
}
