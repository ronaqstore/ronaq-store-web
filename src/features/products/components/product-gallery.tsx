'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { SmartImage } from '@/components/media/smart-image';
import { ImageLightbox } from '@/components/media/image-lightbox';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { PLACEHOLDER_PRODUCT_IMAGE, productImageSrc } from '@/constants/placeholders';
import { formatEmpty } from '@/lib/formatters';
import { isPreviewableImageSrc } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { ProductGalleryProps } from '@/types/product';

export function ProductGallery({ images = [], productName, badgeLabel }: ProductGalleryProps) {
  const t = useTranslations('catalog');
  const tAria = useTranslations('aria');

  const sortedImages = images.length > 0
    ? [...images].sort((a, b) => a.sortOrder - b.sortOrder)
    : [{ id: 'placeholder', url: '', sortOrder: 0 }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeImage = sortedImages[Math.min(activeIndex, sortedImages.length - 1)] ?? sortedImages[0];
  const altText = formatEmpty(productName);
  const hasMultipleImages = sortedImages.length > 1;
  const canPreview = isPreviewableImageSrc(activeImage.url);
  const activeImageUrl = canPreview ? activeImage.url.trim() : PLACEHOLDER_PRODUCT_IMAGE;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % sortedImages.length);
  }, [sortedImages.length, setActiveIndex]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  }, [sortedImages.length, setActiveIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const diffX = touchStartX.current - touch.clientX;
    const diffY = touchStartY.current - touch.clientY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleOpenLightbox = () => {
    if (canPreview) {
      setIsLightboxOpen(true);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPrev();
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNext();
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleKeyDownPreview = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleOpenLightbox();
    }
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen, goToNext, goToPrev]);

  return (
    <div className='relative w-full space-y-3 lg:space-y-4 min-w-0'>
      <div
        className='group relative aspect-square w-full max-h-[440px] md:max-h-[480px] lg:max-h-none overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-b from-muted/20 to-muted/40 shadow-xs transition-all'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {badgeLabel ? (
          <div className='absolute inset-s-3 top-3 z-20 pointer-events-none'>
            <span className='inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md border border-border/60'>
              {badgeLabel}
            </span>
          </div>
        ) : null}

        {hasMultipleImages ? (
          <div className='absolute inset-e-3 bottom-3 z-20 pointer-events-none'>
            <span className='rounded-full bg-background/85 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 shadow-xs backdrop-blur-md border border-border/50 tabular-nums'>
              {activeIndex + 1} / {sortedImages.length}
            </span>
          </div>
        ) : null}

        {canPreview ? (
          <Button
            type='button'
            variant='secondary'
            size='icon'
            className='absolute inset-e-3 top-3 z-20 h-11 w-11 min-h-[44px] min-w-[44px] rounded-full bg-background/90 shadow-xs backdrop-blur-md transition-transform duration-200 hover:scale-105 hover:bg-background'
            onClick={handleOpenLightbox}
            aria-label={t('fullscreen')}
          >
            <Icons.maximize className='h-4 w-4 text-foreground/80' />
          </Button>
        ) : null}

        <div
          className='relative h-full w-full cursor-zoom-in'
          onClick={handleOpenLightbox}
          role='button'
          tabIndex={0}
          onKeyDown={handleKeyDownPreview}
          aria-label={tAria('previewImage')}
        >
          <div
            className={cn(
              'relative h-full w-full transition-transform duration-200 ease-out select-none motion-reduce:transition-none motion-reduce:transform-none',
              isHovered ? '[@media(hover:hover)]:scale-110 sm:[@media(hover:hover)]:scale-120' : ''
            )}
          >
            <SmartImage
              src={activeImageUrl}
              alt={altText}
              fill
              priority
              className='object-contain p-4 sm:p-6 md:p-8 lg:p-10 select-none'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px'
              fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
            />
          </div>
        </div>

        {hasMultipleImages ? (
          <>
            <button
              type='button'
              onClick={handlePrevImage}
              className='absolute inset-s-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-md transition-opacity duration-200 hover:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-600 md:opacity-0 md:group-hover:opacity-100'
              aria-label={t('prevImage')}
            >
              <Icons.chevronLeft className='h-5 w-5 rtl:rotate-180' />
            </button>
            <button
              type='button'
              onClick={handleNextImage}
              className='absolute inset-e-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-md transition-opacity duration-200 hover:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-600 md:opacity-0 md:group-hover:opacity-100'
              aria-label={t('nextImage')}
            >
              <Icons.chevronRight className='h-5 w-5 rtl:rotate-180' />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className='flex items-center justify-center gap-1.5 sm:hidden py-1'>
          {sortedImages.map((img, idx) => (
            <button
              key={`dot-${img.id || idx}`}
              type='button'
              onClick={() => setActiveIndex(idx)}
              className='p-1.5 focus:outline-none'
              aria-label={t('slideNumber', { n: idx + 1 })}
            >
              <span
                className={cn(
                  'block h-2 rounded-full transition-all duration-200',
                  idx === activeIndex
                    ? 'w-6 bg-emerald-600 dark:bg-emerald-500'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                )}
              />
            </button>
          ))}
        </div>
      ) : null}

      {hasMultipleImages ? (
        <div className='hidden sm:flex items-center gap-2.5 overflow-x-auto p-1.5 scrollbar-none'>
          {sortedImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${image.id || index}`}
                type='button'
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-card p-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600',
                  isActive
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30 shadow-xs'
                    : 'border-border/70 opacity-70 hover:opacity-100 hover:border-emerald-600/50'
                )}
                aria-label={t('viewImage', { n: index + 1 })}
              >
                <div className='relative h-full w-full overflow-hidden rounded-[9px] bg-muted/20'>
                  <SmartImage
                    src={productImageSrc(image.url)}
                    alt={altText}
                    fill
                    className='object-cover select-none'
                    sizes='72px'
                    fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      <ImageLightbox
        src={activeImageUrl}
        alt={altText}
        open={isLightboxOpen}
        onOpenChange={setIsLightboxOpen}
      />
    </div>
  );
}
