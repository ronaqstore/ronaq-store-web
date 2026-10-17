export function isLocalStaticImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

export function isPreviewableImageSrc(src?: string | null): src is string {
  const value = src?.trim();
  if (!value) return false;
  if (value.includes('/placeholders/')) return false;
  return true;
}

export function shouldSkipImageOptimization(src: string): boolean {
  if (isLocalStaticImage(src)) return true;
  if (/\.svg($|\?)/i.test(src)) return true;
  return src.toLowerCase().includes('.r2.dev/');
}

export const STOREFRONT_IMAGE_QUALITY = 65;
