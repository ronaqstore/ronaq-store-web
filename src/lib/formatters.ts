import { fromPaisa } from '@/lib/money';
import { WHATSAPP_BASE_URL } from '@/constants/api';

export function formatPrice(paisa?: string | number | null): string {
  if (paisa == null) return 'Rs. 0';
  const numericPaisa = typeof paisa === 'string' ? Number(paisa) : paisa;
  if (Number.isNaN(numericPaisa)) return 'Rs. 0';
  return `Rs. ${Math.round(fromPaisa(numericPaisa)).toLocaleString('en-PK')}`;
}

export function formatPhone(phone?: string | null): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('03')) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
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
