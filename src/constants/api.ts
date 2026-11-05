import { ADMIN_URL, API_URL, SITE_URL } from '@/config/site-config';
import type { SupportContact } from '@/types/common';

export const API_BASE_URL = API_URL;
export const APP_BASE_URL = SITE_URL;
export const ADMIN_BASE_URL = ADMIN_URL;

export const IP_LOOKUP_URL = 'https://ipwho.is/';
export const WHATSAPP_BASE_URL = 'https://wa.me';
export const GOOGLE_TAG_MANAGER_SCRIPT_URL = 'https://www.googletagmanager.com/gtag/js';

export const GOOGLE_MAPS_EMBED_BASE = 'https://maps.google.com/maps';
export const GOOGLE_MAPS_SEARCH_BASE = 'https://www.google.com/maps/search/';

export function buildGaInitScript(gaId: string): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
}

export function normalizePakistaniMobile(rawPhone?: string | null): string | null {
  if (!rawPhone || typeof rawPhone !== 'string') return null;
  let digits = rawPhone.replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('0092')) digits = digits.slice(2);
  if (digits.startsWith('92') && digits.length >= 12) {
    return digits.slice(0, 12);
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    return `92${digits}`;
  }
  if (digits.startsWith('92')) return digits;
  return digits;
}

export function buildWhatsAppUrl(phone?: string | null, message = ''): string {
  const normalized = normalizePakistaniMobile(phone);
  if (!normalized) return '#';
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `${WHATSAPP_BASE_URL}/${normalized}${text}`;
}

export function buildTelUrl(phone?: string | null): string {
  const normalized = normalizePakistaniMobile(phone);
  if (!normalized) return '#';
  return `tel:+${normalized}`;
}

export function googleMapsEmbedUrl(lat: number, lng: number): string {
  const q = encodeURIComponent(`${lat},${lng}`);
  return `${GOOGLE_MAPS_EMBED_BASE}?q=${q}&hl=en&z=16&output=embed`;
}

export function googleMapsSearchUrl(lat: number, lng: number): string {
  return `${GOOGLE_MAPS_SEARCH_BASE}?api=1&query=${lat},${lng}`;
}

export const SUPPORT_CONTACTS: readonly SupportContact[] = [
  {
    phone: '03029825213',
    display: '0302 9825213',
    whatsappUrl: 'https://wa.me/923029825213?text=Assalam-o-Alaikum%20Ronaq%20Store%20Support',
    telUrl: 'tel:+923029825213'
  },
  {
    phone: '03484894115',
    display: '0348 4894115',
    whatsappUrl: 'https://wa.me/923484894115?text=Assalam-o-Alaikum%20Ronaq%20Store%20Support',
    telUrl: 'tel:+923484894115'
  }
] as const;

export const SOCIAL_URLS = {
  whatsappSupport:
    'https://wa.me/923029825213?text=Assalam-o-Alaikum%20Ronaq%20Store%20Support',
  whatsappSupportSecondary:
    'https://wa.me/923484894115?text=Assalam-o-Alaikum%20Ronaq%20Store%20Support',
  youtube: 'https://www.youtube.com/@ronaqstores',
  instagram: 'https://www.instagram.com/ronaqstores',
  tiktok: 'https://www.tiktok.com/@ronaqstores',
  facebook: 'https://web.facebook.com/ronaqstores'
} as const;
