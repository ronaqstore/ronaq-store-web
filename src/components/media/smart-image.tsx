import Image from 'next/image';
import { shouldSkipImageOptimization, STOREFRONT_IMAGE_QUALITY } from '@/lib/media';
import type { SmartImageProps } from '@/types/media';

export function SmartImage({
  src,
  alt,
  priority = false,
  quality = STOREFRONT_IMAGE_QUALITY,
  loading,
  ...props
}: SmartImageProps) {
  const srcString = typeof src === 'string' ? src : '';
  const unoptimized = shouldSkipImageOptimization(srcString);

  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      quality={unoptimized ? undefined : quality}
      loading={priority ? undefined : (loading ?? 'lazy')}
      unoptimized={unoptimized}
      {...props}
    />
  );
}
