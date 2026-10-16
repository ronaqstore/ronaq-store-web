export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(
  /\/+$/,
  ''
);

export const ADMIN_BASE_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3006'
).replace(/\/+$/, '');

export const WHATSAPP_BASE_URL = 'https://wa.me';

export const GOOGLE_MAPS_BASE_URL = 'https://maps.google.com';

export const SOCIAL_URLS = {
  whatsapp: 'https://wa.me/923001234567?text=Assalam-o-Alaikum%20DukanPro',
  whatsappSupport: 'https://wa.me/923001234567?text=Assalam-o-Alaikum%20DukanPro%20Support',
  facebook: 'https://facebook.com/dukanpropk',
  instagram: 'https://instagram.com/dukanpropk',
  twitter: 'https://x.com/dukanpropk',
  youtube: 'https://youtube.com/@dukanpropk'
} as const;

export const SUPPORT_PHONE = '+92 300 1234567';

export const SUPPORT_PHONE_TEL = 'tel:+923001234567';

