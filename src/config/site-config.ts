import { env } from '@/config/env';
import { type AppLocale } from '@/i18n/request';

export const SITE_URL: string = (
  env.NEXT_PUBLIC_SITE_URL ??
  env.NEXT_PUBLIC_APP_URL ??
  'https://www.ronaqstores.com'
).replace(/\/+$/, '');

export const SITE_NAME = 'Ronaq Store';
export const SITE_TAGLINE = 'Mobile Phones & Accessories in KPK';
export const DEFAULT_DESCRIPTION =
  'Discover verified local mobile shops across KPK (Timergara, Lower Dir, Swat, Chakdara, Batkhela). Live smartphone prices, PTA status, and direct WhatsApp contact.';

export const ADMIN_URL: string = (
  env.NEXT_PUBLIC_ADMIN_URL ?? 'https://admin.ronaqstores.com'
).replace(/\/+$/, '');

export const API_URL: string = (
  env.NEXT_PUBLIC_API_URL ?? 'https://ronaq-store-backend.vercel.app'
).replace(/\/+$/, '');

export const HREFLANG_MAP: Record<AppLocale, string> = {
  en: 'en',
  ur: 'ur',
  ps: 'ps',
  roman: 'ur-Latn'
};
