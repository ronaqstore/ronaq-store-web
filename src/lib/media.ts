export function isLocalStaticImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

export function shouldSkipImageOptimization(src: string): boolean {
  if (isLocalStaticImage(src)) return true;
  return /\.svg($|\?)/i.test(src);
}

export const STOREFRONT_IMAGE_QUALITY = 65;
