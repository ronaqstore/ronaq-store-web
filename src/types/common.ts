import type { ReactNode } from 'react';

export interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export interface StorePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export interface ProductPageProps {
  params: Promise<{ locale: string; slug: string; productId: string }>;
}


export interface LocaleAppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface NotFoundViewProps {
  onBack: () => void;
  onHome: () => void;
}

