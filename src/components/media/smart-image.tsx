'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { shouldSkipImageOptimization, STOREFRONT_IMAGE_QUALITY } from '@/lib/media';
import type { SmartImageProps } from '@/types/media';

export function SmartImage({
  src,
  alt,
  priority = false,
  quality = STOREFRONT_IMAGE_QUALITY,
  loading,
  fallbackSrc,
  onError,
  ...props
}: SmartImageProps) {
  const initialSrc = typeof src === 'string' ? src : '';
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(typeof src === 'string' ? src : '');
    setFailed(false);
  }, [src]);

  const activeSrc = failed && fallbackSrc ? fallbackSrc : currentSrc || src;
  const srcString = typeof activeSrc === 'string' ? activeSrc : '';
  const unoptimized = shouldSkipImageOptimization(srcString);

  const handleError: NonNullable<SmartImageProps['onError']> = (event) => {
    if (fallbackSrc && !failed && srcString !== fallbackSrc) {
      setFailed(true);
      setCurrentSrc(fallbackSrc);
    }
    onError?.(event);
  };

  return (
    <Image
      src={activeSrc}
      alt={alt}
      priority={priority}
      quality={unoptimized ? undefined : quality}
      loading={priority ? undefined : (loading ?? 'lazy')}
      unoptimized={unoptimized}
      onError={handleError}
      {...props}
    />
  );
}
