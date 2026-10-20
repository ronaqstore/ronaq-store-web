'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/media/smart-image';
import { isPreviewableImageSrc } from '@/lib/media';
import type { ImageLightboxProps } from '@/types/media';

export function ImageLightbox({ src, alt, open, onOpenChange }: ImageLightboxProps) {
  const t = useTranslations();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onOpenChange]);

  if (!open || !isPreviewableImageSrc(src)) return null;

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div
      className='fixed inset-0 z-[80] flex items-center justify-center bg-background/90 p-4 backdrop-blur-sm animate-in fade-in'
      role='dialog'
      aria-modal='true'
      aria-label={alt}
    >
      <button
        type='button'
        className='absolute inset-0 cursor-zoom-out border-0 bg-transparent'
        aria-label={t('aria.closeModal')}
        onClick={handleClose}
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute inset-e-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80'
        onClick={handleClose}
        aria-label={t('aria.closeModal')}
      >
        <Icons.close className='h-5 w-5' />
      </Button>

      <div className='relative z-10 h-[min(90vh,900px)] w-full max-w-5xl'>
        <SmartImage
          src={src.trim()}
          alt={alt}
          fill
          priority
          className='object-contain'
          sizes='(max-width: 1024px) 100vw, 1024px'
        />
      </div>
    </div>
  );
}
