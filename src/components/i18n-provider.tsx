'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { I18nProviderProps } from '@/types/common';

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code === 'MISSING_MESSAGE') return;
      }}
      getMessageFallback={({ key }) => key}
    >
      {children}
    </NextIntlClientProvider>
  );
}
