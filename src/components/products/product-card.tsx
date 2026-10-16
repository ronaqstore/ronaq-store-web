import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatPrice, buildWhatsAppLink } from '@/lib/formatters';
import type { ProductCardProps } from '@/types/product';

export function ProductCard({
  product,
  storeName,
  storePhone,
  onSelectProduct
}: ProductCardProps) {
  const t = useTranslations();

  const formattedPrice = formatPrice(product.retailPrice);

  const whatsappMessage = `Hello ${storeName}, I am interested in buying "${product.name}" (${formattedPrice}) listed on your DukanPro store. Is it available in stock?`;
  const whatsappHref = buildWhatsAppLink(storePhone, whatsappMessage);

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

  return (
    <Card className='group overflow-hidden rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between'>
      <div
        className='cursor-pointer'
        onClick={() => onSelectProduct?.(product)}
      >
        <div className='relative h-48 w-full bg-muted/40 flex items-center justify-center overflow-hidden border-b border-border/50'>
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              className='object-contain p-4 group-hover:scale-105 transition-transform duration-300'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex flex-col items-center justify-center text-muted-foreground/60 gap-2'>
              <Icons.mobile className='h-12 w-12 stroke-[1.25]' />
              <span className='text-[11px] font-medium tracking-wide uppercase'>
                {product.brandName || product.categoryName}
              </span>
            </div>
          )}

          <div className='absolute top-2.5 start-2.5 flex flex-col gap-1'>
            {getPtaBadge()}
          </div>

          <div className='absolute top-2.5 end-2.5'>
            {product.inStock ? (
              <Badge variant='outline' className='bg-background/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]'>
                {t('catalog.inStock')}
              </Badge>
            ) : (
              <Badge variant='destructive' className='text-[10px]'>
                {t('catalog.outOfStock')}
              </Badge>
            )}
          </div>
        </div>

        <div className='p-4 space-y-2'>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            {product.brandName ? <span>{product.brandName}</span> : null}
            {product.brandName && product.categoryName ? <span>•</span> : null}
            <span>{product.categoryName}</span>
          </div>

          <h4 className='font-bold text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors'>
            {product.name}
          </h4>

          <div className='pt-1 flex items-baseline justify-between'>
            <span className='text-lg font-extrabold text-foreground tracking-tight text-primary'>
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>

      <div className='p-4 pt-0'>
        <a
          href={whatsappHref}
          target='_blank'
          rel='noopener noreferrer'
          className='w-full block'
        >
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
