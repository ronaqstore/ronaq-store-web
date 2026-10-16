import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import { isLocale, isRtlLocale, locales, type AppLocale } from '@/i18n/request';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import type { LocaleLayoutProps } from '@/types/common';
import '@/styles/globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap'
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'DukanPro — Discover Verified Local Mobile Shops',
  description: 'Search local mobile phone and electronics shops across Pakistan. Check PTA status, live stock, and chat directly on WhatsApp.',
  icons: {
    icon: '/favicon.ico'
  }
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
        className={`${poppins.className} min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary/20 selection:text-primary flex flex-col justify-between`}
        suppressHydrationWarning
      >
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <main className='flex-1'>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
