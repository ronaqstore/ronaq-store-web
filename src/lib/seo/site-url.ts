import { APP_BASE_URL } from '@/constants/api';

export function getSiteUrl(): string {
  return APP_BASE_URL;
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function localePath(locale: string, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function absoluteLocaleUrl(locale: string, path = '/'): string {
  return absoluteUrl(localePath(locale, path));
}
