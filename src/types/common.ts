import type { ReactNode } from 'react';
import type { AbstractIntlMessages } from 'next-intl';

export interface LocaleParams {
  locale: string;
}

export interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<LocaleParams>;
}

export interface I18nProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}

export interface HomeSearchParams {
  q?: string;
}

export interface HomePageProps {
  params: Promise<LocaleParams>;
  searchParams: Promise<HomeSearchParams>;
}

export interface CatalogSearchParams {
  q?: string;
  category?: string;
  inStock?: string;
}

export interface StoreRouteParams {
  locale: string;
  slug: string;
}

export interface StorePageProps {
  params: Promise<StoreRouteParams>;
  searchParams: Promise<CatalogSearchParams>;
}

export interface ProductRouteParams {
  locale: string;
  slug: string;
  productId: string;
}

export interface ProductPageProps {
  params: Promise<ProductRouteParams>;
}

export interface ModelRouteParams {
  locale: string;
  slug: string;
  modelKey: string;
}

export interface ModelPageProps {
  params: Promise<ModelRouteParams>;
}

export interface LocaleAppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export type PublicFetchCache = { revalidate: number } | { cache: 'no-store' };

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
