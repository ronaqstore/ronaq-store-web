import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPublicStoreProfile } from '@/features/stores/api/service';
import { getStoreProductDetail } from '@/features/products/api/service';
import { formatPrice, buildWhatsAppLink } from '@/lib/formatters';
import type { ProductPageProps } from '@/types/common';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, productId } = await params;
  const product = await getStoreProductDetail(slug, productId);
  const title = product ? `${product.name} — Ronaq Store` : 'Product Details — Ronaq Store';

  return {
    title,
    description: product?.description || title,
    openGraph: { title, description: product?.description || title }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug, productId } = await params;
  const [store, product, t] = await Promise.all([
    getPublicStoreProfile(slug),
    getStoreProductDetail(slug, productId),
    getTranslations('catalog')
  ]);

  if (!store || !product) notFound();

  const formattedPrice = formatPrice(product.retailPrice);
  const whatsappHref = buildWhatsAppLink(
    store.phoneNumber,
    `Hello ${store.displayName}, I want to buy "${product.name}" (${formattedPrice}).`
  );

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6'>
      <Link href={`/shop/${slug}`}>
        <Button type='button' variant='ghost' size='sm' className='gap-2'>
          <Icons.arrowLeft className='h-4 w-4' />
          {store.displayName}
        </Button>
      </Link>

      <div className='rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6'>
        <div className='space-y-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline'>{product.categoryName}</Badge>
            {product.brandName ? <Badge variant='secondary'>{product.brandName}</Badge> : null}
            {product.inStock ? (
              <Badge variant='outline' className='text-emerald-600 border-emerald-500/30'>
                {t('inStock')}
              </Badge>
            ) : null}
          </div>

          <h1 className='text-2xl sm:text-3xl font-extrabold text-foreground'>
            {product.name}
          </h1>

          <div className='text-3xl font-black text-primary'>{formattedPrice}</div>
        </div>

        <a href={whatsappHref} target='_blank' rel='noopener noreferrer' className='block'>
          <Button type='button' size='lg' className='w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold'>
            <Icons.whatsapp className='h-5 w-5' />
            {t('orderWhatsApp')}
          </Button>
        </a>
      </div>
    </div>
  );
}
