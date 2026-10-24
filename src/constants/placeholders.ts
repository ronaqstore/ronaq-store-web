import { APP_BASE_URL } from '@/constants/api';

export const PLACEHOLDER_PRODUCT_IMAGE = '/placeholders/product.svg';
export const PLACEHOLDER_SHOP_LOGO = '/placeholders/shop-logo.svg';
export const IMAGE_PLACEHOLDER_BLUR = 'blur' as const;

export function productImageSrc(url?: string | null): string {
  return url?.trim() ? url : PLACEHOLDER_PRODUCT_IMAGE;
}

export function absoluteProductImageUrl(url?: string | null): string {
  const src = productImageSrc(url);
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${APP_BASE_URL}${src.startsWith('/') ? src : `/${src}`}`;
}
