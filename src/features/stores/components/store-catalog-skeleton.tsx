import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function StoreCatalogSkeleton() {
  return (
    <div className='space-y-5'>
      <Skeleton className='h-3 w-32' />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
