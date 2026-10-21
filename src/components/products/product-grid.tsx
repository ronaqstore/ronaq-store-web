import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { ProductCard } from './product-card';
import type { ProductGridProps } from '@/types/product';

export function ProductGrid({
  products,
  storeSlug,
  storeName,
  storePhone,
  onSelectProduct,
  linkToModel = true
}: ProductGridProps) {
  const t = useTranslations();

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center space-y-3'>
        <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
          <Icons.mobile className='h-7 w-7' />
        </div>
        <h3 className='font-semibold text-foreground text-base'>{t('catalog.noProducts')}</h3>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          storeSlug={storeSlug}
          storeName={storeName}
          storePhone={storePhone}
          onSelectProduct={onSelectProduct}
          priority={index < 2}
          linkToModel={linkToModel}
        />
      ))}
    </div>
  );
}
