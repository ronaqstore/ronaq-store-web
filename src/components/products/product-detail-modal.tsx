import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productImageSrc } from '@/constants/placeholders';
import { formatPrice, buildWhatsAppLink, formatEmpty } from '@/lib/formatters';
import type { ProductDetailModalProps } from '@/types/product';

export function ProductDetailModal({
  product,
  storeName,
  storePhone,
  onClose
}: ProductDetailModalProps) {
  const t = useTranslations();

  if (!product) return null;

  const formattedPrice = formatPrice(product.retailPrice);
  const whatsappMessage = `Hello ${storeName}, I am interested in buying "${product.name}" (${formattedPrice}) listed on your Ronaq Store.`;
  const whatsappHref = buildWhatsAppLink(storePhone, whatsappMessage);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in'>
      <div className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl p-6'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute end-4 top-4 h-8 w-8 rounded-full'
          onClick={onClose}
          aria-label={t('aria.closeModal')}
        >
          <Icons.close className='h-4 w-4' />
        </Button>

        <div className='space-y-6'>
          <div className='relative h-64 sm:h-80 w-full bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center border border-border/50'>
            <Image
              src={productImageSrc(product.images?.[0]?.url)}
              alt={formatEmpty(product.name)}
              fill
              unoptimized
              className='object-contain p-6'
              sizes='(max-width: 768px) 100vw, 600px'
            />
          </div>

          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline'>{formatEmpty(product.categoryName)}</Badge>
              <Badge variant='secondary'>{formatEmpty(product.brandName)}</Badge>
              {product.ptaStatus === 'APPROVED' ? (
                <Badge variant='success'>{t('catalog.ptaApproved')}</Badge>
              ) : null}
              {product.inStock ? (
                <Badge variant='outline' className='text-emerald-600 dark:text-emerald-400 border-emerald-500/30'>
                  {t('catalog.inStock')}
                </Badge>
              ) : (
                <Badge variant='destructive'>{t('catalog.outOfStock')}</Badge>
              )}
            </div>

            <h2 className='text-2xl font-bold text-foreground'>{formatEmpty(product.name)}</h2>

            <div className='text-3xl font-extrabold text-primary'>
              {formattedPrice}
            </div>

            <div className='space-y-1.5 pt-2 border-t border-border/50'>
              <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('catalog.description')}
              </h4>
              <p className='text-sm text-foreground/90 whitespace-pre-line leading-relaxed'>
                {formatEmpty(product.description)}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3 pt-3 border-t border-border/50 text-xs'>
              <div className='rounded-lg bg-muted/40 p-2.5'>
                <span className='text-muted-foreground'>{t('catalog.condition')}: </span>
                <span className='font-semibold text-foreground'>
                  {formatEmpty(product.condition)}
                </span>
              </div>
              <div className='rounded-lg bg-muted/40 p-2.5'>
                <span className='text-muted-foreground'>{t('catalog.warranty')}: </span>
                <span className='font-semibold text-foreground'>
                  {formatEmpty(product.warrantyType)}
                </span>
              </div>
            </div>
          </div>

          <div className='pt-2'>
            <a
              href={whatsappHref}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full block'
            >
              <Button
                type='button'
                size='lg'
                className='w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md'
              >
                <Icons.whatsapp className='h-5 w-5' />
                {t('catalog.inquireWhatsApp')}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
