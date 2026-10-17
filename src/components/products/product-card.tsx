'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SmartImage } from '@/components/media/smart-image';
import { productImageSrc } from '@/constants/placeholders';
import { formatPrice, buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import { StockBadge } from '@/components/products/stock-badge';
import { productPath } from '@/lib/seo/slug';
import type { ProductCardProps } from '@/types/product';

export function ProductCard({
  product,
  storeSlug,
  storeName,
  storePhone,
  onSelectProduct,
  priority = false
}: ProductCardProps) {
  const t = useTranslations();

  const formattedPrice = product.contactForPrice
    ? t('catalog.contactForPrice')
    : formatPrice(product.retailPrice);

  const whatsappMessage = t('whatsapp.inquireProduct', {
    storeName,
    productName: product.name,
    price: formattedPrice
  });
  const whatsappHref = buildWhatsAppLink(storePhone, whatsappMessage);
  const href = storeSlug ? productPath(storeSlug, product.name, product.id) : undefined;

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
      default:
        return null;
    }
  };

  const media = (
    <>
      <div className='relative h-48 w-full bg-muted/40 flex items-center justify-center overflow-hidden border-b border-border/50'>
        <SmartImage
          src={productImageSrc(product.primaryImageUrl)}
          alt={formatEmpty(product.name)}
          fill
          priority={priority}
          className='object-contain p-4 group-hover:scale-105 transition-transform duration-300'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />

        <div className='absolute top-2.5 start-2.5 flex flex-col gap-1'>{getPtaBadge()}</div>

        <div className='absolute top-2.5 end-2.5'>
          <StockBadge availability={product.availability} stockCount={product.stockCount} />
        </div>
      </div>

      <div className='p-4 space-y-2'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <span>{formatEmpty(product.brandName)}</span>
          <span>•</span>
          <span>{formatEmpty(product.categoryName)}</span>
        </div>

        <h3 className='font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors'>
          {formatEmpty(product.name)}
        </h3>

        <div className='pt-1 flex items-baseline justify-between'>
          <span className='text-lg font-extrabold text-foreground tracking-tight text-primary'>
            {formattedPrice}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Card className='group overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between'>
      {href ? (
        <Link href={href} className='block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
          {media}
        </Link>
      ) : (
        <button
          type='button'
          className='cursor-pointer text-start'
          onClick={() => onSelectProduct?.(product)}
        >
          {media}
        </button>
      )}

      <div className='p-4 pt-0'>
        <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='w-full block'>
          <Button
            type='button'
            size='sm'
            className='w-full gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
          >
            <Icons.whatsapp className='h-4 w-4' />
            {t('catalog.orderWhatsApp')}
          </Button>
        </a>
      </div>
    </Card>
  );
}
