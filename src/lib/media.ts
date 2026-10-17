export function isLocalStaticImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

export function isPreviewableImageSrc(src?: string | null): boolean {
  const value = src?.trim();
  if (!value) return false;
  if (value.includes('/placeholders/')) return false;
  return true;
}

export function shouldSkipImageOptimization(src: string): boolean {
  if (isLocalStaticImage(src)) return true;
  if (/\.svg($|\?)/i.test(src)) return true;
  return /\.r2\.dev\//i.test(src);
}

export const STOREFRONT_IMAGE_QUALITY = 65;
