'use client';

import { useState } from 'react';
import { SmartImage } from '@/components/media/smart-image';
import { productImageSrc } from '@/constants/placeholders';
import { formatEmpty } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { ProductImageGalleryProps } from '@/types/product';

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const sorted =
    images.length > 0
      ? [...images].sort((a, b) => a.sortOrder - b.sortOrder)
      : [{ id: 'placeholder', url: '', sortOrder: 0 }];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[Math.min(activeIndex, sorted.length - 1)] ?? sorted[0];
  const alt = formatEmpty(productName);

  return (
    <div className='space-y-3'>
      <div className='relative h-72 sm:h-96 w-full bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center border border-border/50'>
        <SmartImage
          src={productImageSrc(active.url)}
          alt={alt}
          fill
          priority
          className='object-contain p-6'
          sizes='(max-width: 768px) 100vw, 700px'
        />
      </div>

      {sorted.length > 1 ? (
        <div className='flex flex-wrap gap-2'>
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type='button'
              onClick={() => setActiveIndex(index)}
              className={cn(
                'relative h-16 w-16 overflow-hidden rounded-xl border bg-muted/30 transition-colors',
                index === activeIndex
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border/50 hover:border-primary/40'
              )}
            >
              <SmartImage
                src={productImageSrc(image.url)}
                alt={`${alt} ${index + 1}`}
                fill
                className='object-contain p-1.5'
                sizes='64px'
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
