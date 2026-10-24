'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import { formatPrice, formatEmpty, formatProductCardTitle } from '@/lib/formatters';
import { TruncateText } from '@/components/ui/truncate-text';
import { productPath } from '@/lib/seo/slug';
import type { MarketplaceProductCardProps } from '@/types/marketplace';

export function MarketplaceProductCard({
  product,
  priority = false
}: MarketplaceProductCardProps) {
  const t = useTranslations();
  const title = formatProductCardTitle(product.name, product.brandName);
  const formattedPrice = formatPrice(product.retailPrice);
  const href = productPath(product.shop.slug, product.name, product.id);

  return (
    <Card className='group flex h-full flex-col overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md'>
      <Link href={href} className='flex flex-1 flex-col focus-visible:outline-none'>
        <div className='relative aspect-square overflow-hidden bg-muted/40 sm:aspect-[4/3]'>
          <PreviewableImage
            src={product.primaryImageUrl}
            alt={formatEmpty(title)}
            className='h-full w-full'
            imageClassName='object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]'
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
            priority={priority}
          />
        </div>

        <div className='flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5'>
          {product.brandName ? (
            <p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
              {product.brandName}
            </p>
          ) : null}
          <TruncateText className='text-sm font-semibold leading-snug text-foreground'>
            {title}
          </TruncateText>
          <div className='flex items-center gap-1 text-[11px] text-muted-foreground'>
            <Icons.store className='h-3 w-3 shrink-0' />
            <TruncateText>
              {product.shop.displayName}
              {product.shop.city ? ` · ${product.shop.city}` : ''}
            </TruncateText>
          </div>
          <div className='mt-auto flex items-end justify-between gap-2 pt-2'>
            <p className='text-base font-bold text-primary'>
              {formattedPrice || t('catalog.price')}
            </p>
            {product.availability === 'OUT_OF_STOCK' ? (
              <Badge variant='secondary' className='text-[10px]'>
                {t('catalog.outOfStock')}
              </Badge>
            ) : (
              <Badge variant='success' className='text-[10px]'>
                {t('catalog.inStock')}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
