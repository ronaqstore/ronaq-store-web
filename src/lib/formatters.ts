import { fromPaisa } from '@/lib/money';
import { WHATSAPP_BASE_URL } from '@/constants/api';
import type { StoreWhatsAppContact } from '@/types/store';

export const EMPTY_DISPLAY = '—';

export function formatEmpty(
  value: string | number | null | undefined,
  fallback: string = EMPTY_DISPLAY
): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && value.trim() === '') return fallback;
  return String(value);
}

export function formatTitleCase(value: string | null | undefined): string {
  if (!value?.trim()) return '';
  return value
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (/^\d/.test(word)) return word.toUpperCase();
      if (word.length <= 3 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function formatStorageLabel(storage: string | null | undefined): string {
  if (!storage?.trim()) return '';
  const raw = storage.trim();
  if (/\b(gb|tb|mb)\b/i.test(raw)) return raw.toUpperCase().replace(/\s+/g, ' ');
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    if (n >= 1024) return `${(n / 1024).toString().replace(/\.0$/, '')} TB`;
    return `${raw} GB`;
  }
  return raw;
}

export function formatColorLabel(color: string | null | undefined): string {
  if (!color?.trim()) return '';
  return formatTitleCase(color);
}

export function formatProductCardTitle(
  name: string | null | undefined,
  brandName?: string | null
): string {
  const titled = formatTitleCase(name);
  if (!titled) return EMPTY_DISPLAY;
  const brand = formatTitleCase(brandName);
  if (!brand) return titled;
  if (titled.toLowerCase().startsWith(brand.toLowerCase())) return titled;
  return titled;
}

export function formatPrice(paisa?: string | number | null): string {
  if (paisa == null) return EMPTY_DISPLAY;
  const numericPaisa = typeof paisa === 'string' ? Number(paisa) : paisa;
  if (Number.isNaN(numericPaisa)) return EMPTY_DISPLAY;
  return `Rs ${Math.round(fromPaisa(numericPaisa)).toLocaleString('en-PK')}`;
}

export function formatPhone(phone?: string | null): string {
  if (!phone || typeof phone !== 'string') return EMPTY_DISPLAY;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return EMPTY_DISPLAY;
  if (digits.length === 11 && digits.startsWith('03')) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  if (digits.length === 12 && digits.startsWith('92')) {
    return `0${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  return phone;
}

export function buildWhatsAppLink(rawPhone?: string | null, message = ''): string {
  if (!rawPhone || typeof rawPhone !== 'string') return '#';
  let clean = rawPhone.replace(/\D/g, '');
  if (!clean) return '#';
  if (clean.startsWith('03')) {
    clean = `92${clean.slice(1)}`;
  } else if (!clean.startsWith('92') && clean.length === 10) {
    clean = `92${clean}`;
  }
  return `${WHATSAPP_BASE_URL}/${clean}?text=${encodeURIComponent(message)}`;
}

export function resolveStoreWhatsAppNumber(store: StoreWhatsAppContact): string {
  return store.whatsappNumber?.trim() || '';
}
