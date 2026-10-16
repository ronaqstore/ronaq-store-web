import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { formatPrice, buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import type { ProductDetailViewProps } from '@/types/product';

export async function ProductDetailView({
  slug,
  storeName,
  storePhone,
  product
}: ProductDetailViewProps) {
  const t = await getTranslations('catalog');
  const formattedPrice = formatPrice(product.retailPrice);
  const whatsappHref = buildWhatsAppLink(
    storePhone,
    `Hello ${storeName}, I want to buy "${product.name}" (${formattedPrice}).`
  );

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6'>
      <Link href={`/shop/${slug}`}>
        <Button type='button' variant='ghost' size='sm' className='gap-2'>
          <Icons.arrowLeft className='h-4 w-4' />
          {formatEmpty(storeName)}
        </Button>
      </Link>

      <div className='rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6'>
        <ProductImageGallery images={product.images ?? []} productName={product.name} />

        <div className='space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline'>{formatEmpty(product.categoryName)}</Badge>
            <Badge variant='secondary'>{formatEmpty(product.brandName)}</Badge>
            {product.ptaStatus === 'APPROVED' ? (
              <Badge variant='success'>{t('ptaApproved')}</Badge>
            ) : null}
            {product.inStock ? (
              <Badge variant='outline' className='text-emerald-600 border-emerald-500/30'>
                {t('inStock')}
              </Badge>
            ) : (
              <Badge variant='destructive'>{t('outOfStock')}</Badge>
            )}
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-foreground'>
            {formatEmpty(product.name)}
          </h1>

          <div className='text-3xl font-black text-primary'>{formattedPrice}</div>

          <div className='space-y-1.5 pt-2 border-t border-border/50'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              {t('description')}
            </h2>
            <p className='text-sm text-foreground/90 whitespace-pre-line leading-relaxed'>
              {formatEmpty(product.description)}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs'>
            <div className='rounded-lg bg-muted/40 p-2.5'>
              <span className='text-muted-foreground'>{t('condition')}: </span>
              <span className='font-semibold text-foreground'>
                {formatEmpty(product.condition)}
              </span>
            </div>
            <div className='rounded-lg bg-muted/40 p-2.5'>
              <span className='text-muted-foreground'>{t('warranty')}: </span>
              <span className='font-semibold text-foreground'>
                {formatEmpty(product.warrantyType)}
              </span>
            </div>
          </div>
        </div>

        <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='block'>
          <Button
            type='button'
            size='lg'
            className='w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
          >
            <Icons.whatsapp className='h-5 w-5' />
            {t('orderWhatsApp')}
          </Button>
        </a>
      </div>
    </div>
  );
}
