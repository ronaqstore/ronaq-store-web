import type { ReactNode } from 'react';

export interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export interface CatalogSearchParams {
  q?: string;
  category?: string;
  inStock?: string;
}

export interface StorePageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<CatalogSearchParams>;
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

