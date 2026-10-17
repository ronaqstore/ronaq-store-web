import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getMessages, setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import { isLocale, isRtlLocale, locales, type AppLocale } from '@/i18n/request';
import { ThemeProvider } from '@/components/theme-provider';
import { I18nProvider } from '@/components/i18n-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import type { LocaleLayoutProps } from '@/types/common';
import {
  APP_NAME,
  PWA_THEME_COLOR_DARK,
  PWA_THEME_COLOR_LIGHT
} from '@/constants/site';
import { defaultRootMetadata } from '@/lib/seo/metadata';
import '@/styles/globals.css';

const poppins = localFont({
  src: [
    { path: '../../styles/fonts/poppins-400.woff2', weight: '400', style: 'normal' },
    { path: '../../styles/fonts/poppins-600.woff2', weight: '600', style: 'normal' },
    { path: '../../styles/fonts/poppins-700.woff2', weight: '700', style: 'normal' }
  ],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  ...defaultRootMetadata(),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/icons/icon-192.png'
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
            <main id='main-content' className='flex-1 min-w-0'>
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
