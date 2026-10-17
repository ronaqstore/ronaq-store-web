import type { ComponentProps } from 'react';
import type { ImageProps } from 'next/image';

export type SmartImageProps = Omit<ImageProps, 'quality'> & {
  priority?: boolean;
  quality?: number;
  fallbackSrc?: string;
};

export type SkeletonProps = ComponentProps<'div'>;

export interface ImageLightboxProps {
  src: string | null;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface PreviewableImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
}
