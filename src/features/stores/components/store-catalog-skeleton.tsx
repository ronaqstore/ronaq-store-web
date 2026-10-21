import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function StoreCatalogSkeleton() {
  return (
    <div className='mx-auto max-w-[1600px] space-y-5 px-4 pb-10 pt-4 sm:space-y-6 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8'>
      <div className='space-y-4 border-b border-border/60 py-4'>
        <div className='flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center'>
          <Skeleton className='h-9 max-w-md flex-1' />
          <Skeleton className='h-9 w-28' />
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-20 rounded-full' />
          ))}
        </div>
      </div>

      <Skeleton className='h-3 w-32' />

      <ProductGridSkeleton count={8} />
    </div>
  );
}
