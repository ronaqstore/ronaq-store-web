import type { ImageProps } from 'next/image';

export type SmartImageProps = Omit<ImageProps, 'quality'> & {
  priority?: boolean;
  quality?: number;
};
