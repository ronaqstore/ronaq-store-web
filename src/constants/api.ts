export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(
  /\/+$/,
  ''
);

export const APP_BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3007'
).replace(/\/+$/, '');

export const ADMIN_BASE_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3006'
).replace(/\/+$/, '');

export const WHATSAPP_BASE_URL = 'https://wa.me';

export const SOCIAL_URLS = {
  whatsappSupport: 'https://wa.me/923001234567?text=Assalam-o-Alaikum%20Ronaq%20Store%20Support',
  youtube: 'https://www.youtube.com/@ronaqstores',
  instagram: 'https://www.instagram.com/ronaqstores',
  tiktok: 'https://www.tiktok.com/@ronaqstores',
  facebook: 'https://web.facebook.com/ronaqstores'
} as const;

export const SUPPORT_PHONE = '+92 300 1234567';

export const SUPPORT_PHONE_TEL = 'tel:+923001234567';

