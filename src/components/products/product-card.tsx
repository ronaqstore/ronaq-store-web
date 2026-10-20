'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PreviewableImage } from '@/components/media/previewable-image';
import { PLACEHOLDER_PRODUCT_IMAGE } from '@/constants/placeholders';
import { formatPrice, buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import { modelPath, productPath } from '@/lib/seo/slug';
import type { ProductCardProps } from '@/types/product';

export function ProductCard({
  product,
  storeSlug,
  storeName,
  storePhone,
  onSelectProduct,
  priority = false,
  linkToModel = true
}: ProductCardProps) {
  const t = useTranslations();

  const formattedPrice = product.contactForPrice
    ? t('catalog.contactForPrice')
    : formatPrice(product.retailPrice);

  const specDetails = [product.color, product.storage].filter(Boolean).join(', ');
  const fullProductName = specDetails
    ? `${product.name} (${specDetails})`
    : product.name;

  const whatsappMessage = t('whatsapp.inquireProduct', {
    storeName,
    productName: fullProductName,
    price: formattedPrice
  });
  const whatsappHref = buildWhatsAppLink(storePhone, whatsappMessage);
  const href = storeSlug
    ? linkToModel && product.trackingType === 'SERIALIZED' && product.modelKey
      ? modelPath(storeSlug, product.modelKey)
      : productPath(storeSlug, product.name, product.id)
    : undefined;

  const getPtaBadge = () => {
    switch (product.ptaStatus) {
      case 'APPROVED':
        return (
          <Badge variant='success' className='gap-1 text-[10px]'>
            <Icons.shieldCheck className='h-3 w-3' />
            {t('catalog.ptaApproved')}
          </Badge>
        );
      case 'NON_PTA':
        return (
          <Badge variant='warning' className='text-[10px]'>
            {t('catalog.ptaNon')}
          </Badge>
        );
      case 'JV':
        return (
          <Badge variant='secondary' className='text-[10px]'>
            {t('catalog.ptaJv')}
          </Badge>
        );
      case 'BYPASS':
        return (
          <Badge variant='secondary' className='text-[10px]'>
            {t('catalog.ptaBypass')}
          </Badge>
        );
      case 'MDM_BYPASS':
        return (
          <Badge variant='secondary' className='text-[10px]'>
            {t('catalog.ptaMdmBypass')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAuthenticityBadge = () => {
    if (product.authenticity === 'ORIGINAL') {
      return (
        <Badge variant='success' className='text-[10px]'>
          {t('catalog.authenticityOriginal')}
        </Badge>
      );
    }
    if (product.authenticity === 'COPY') {
      return (
        <Badge variant='secondary' className='text-[10px]'>
          {t('catalog.authenticityCopy')}
        </Badge>
      );
    }
    return null;
  };

  const details = (
    <div className='space-y-2 p-4'>
      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
        <span>{formatEmpty(product.brandName)}</span>
        <span>•</span>
        <span>{formatEmpty(product.categoryName)}</span>
      </div>

      <h3 className='line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary'>
        {formatEmpty(product.name)}
      </h3>

      {product.storage || product.color || product.condition ? (
        <div className='flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-muted-foreground'>
          {product.storage ? (
            <span className='rounded bg-muted/70 px-1.5 py-0.5 font-medium text-foreground/80'>
              {product.storage}
            </span>
          ) : null}
          {product.color ? (
            <span className='rounded bg-muted/70 px-1.5 py-0.5 font-medium text-foreground/80'>
              {product.color}
            </span>
          ) : null}
          {product.condition ? (
            <span className='rounded bg-muted/70 px-1.5 py-0.5 font-medium text-foreground/80'>
              {product.condition === 'NEW'
                ? t('catalog.brandNew')
                : product.condition === 'USED'
                  ? t('catalog.used')
                  : product.condition}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className='flex items-baseline justify-between pt-1'>
        <span className='text-lg font-extrabold tracking-tight text-primary'>
          {formattedPrice}
        </span>
      </div>
    </div>
  );

  return (
    <Card className='group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg'>
      <div className='relative h-48 w-full overflow-hidden border-b border-border/50 bg-muted/40'>
        <PreviewableImage
          src={product.primaryImageUrl}
          alt={formatEmpty(product.name)}
          priority={priority}
          className='absolute inset-0 h-full w-full'
          imageClassName='object-contain p-4 transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          fallbackSrc={PLACEHOLDER_PRODUCT_IMAGE}
        />

        <div className='pointer-events-none absolute top-2.5 inset-s-2.5 flex flex-col gap-1'>
          {getPtaBadge()}
          {getAuthenticityBadge()}
        </div>

        <div className='pointer-events-none absolute top-2.5 inset-e-2.5'>
          <StockBadge availability={product.availability} stockCount={product.stockCount} />
        </div>
      </div>

      {href ? (
        <Link
          href={href}
          className='block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          {details}
        </Link>
      ) : (
        <button
          type='button'
          className='cursor-pointer text-start'
          onClick={() => onSelectProduct?.(product)}
        >
          {details}
        </button>
      )}

      {product.contactForPrice && storePhone ? (
        <div className='p-4 pt-0'>
          <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='block w-full'>
            <Button
              type='button'
              size='sm'
              className='w-full gap-2 bg-emerald-600 text-xs text-white shadow-sm hover:bg-emerald-700'
            >
              <Icons.whatsapp className='h-4 w-4' />
              {t('catalog.inquireWhatsApp')}
            </Button>
          </a>
        </div>
      ) : null}
    </Card>
  );
}
