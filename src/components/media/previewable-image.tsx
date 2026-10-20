"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SmartImage } from "@/components/media/smart-image";
import { ImageLightbox } from "@/components/media/image-lightbox";
import { isPreviewableImageSrc } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { PreviewableImageProps } from "@/types/media";

export function PreviewableImage({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority = false,
  fallbackSrc,
}: PreviewableImageProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const canPreview = isPreviewableImageSrc(src);
  const displaySrc = canPreview ? src.trim() : (fallbackSrc ?? src ?? "");

  const openPreview = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  if (!canPreview) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <SmartImage
          src={displaySrc}
          alt={alt}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
          fallbackSrc={fallbackSrc}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "relative block w-full overflow-hidden border-0 bg-transparent p-0 cursor-zoom-in",
          className,
        )}
        onClick={openPreview}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            openPreview(event);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={t("aria.previewImage")}
        suppressHydrationWarning
      >
        <SmartImage
          src={displaySrc}
          alt={alt}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
          fallbackSrc={fallbackSrc}
        />
      </div>
      <ImageLightbox
        src={displaySrc}
        alt={alt}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
