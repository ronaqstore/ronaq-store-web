import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { ProductCard } from './product-card';
import type { ProductGridProps } from '@/types/product';

export function ProductGrid({
  products,
  storeName,
  storePhone,
  onSelectProduct
}: ProductGridProps) {
  const t = useTranslations();

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center space-y-3'>
        <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground'>
          <Icons.mobile className='h-7 w-7' />
        </div>
        <h3 className='font-semibold text-foreground text-base'>
          {t('catalog.noProducts')}
        </h3>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          storeName={storeName}
          storePhone={storePhone}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
}
