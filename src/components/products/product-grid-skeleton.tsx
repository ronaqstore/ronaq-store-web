import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ProductGridSkeletonProps, ProductCardSkeletonProps } from '@/types/product';

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs',
        className
      )}
      aria-hidden
    >
      <Skeleton className='aspect-square w-full rounded-none bg-muted/40' />
      <div className='p-2.5 sm:p-3.5 md:p-4 space-y-2'>
        <Skeleton className='h-2.5 w-16 bg-muted/50' />
        <div className='space-y-1.5 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem]'>
          <Skeleton className='h-3.5 w-full bg-muted/60' />
          <Skeleton className='h-3.5 w-3/4 bg-muted/60' />
        </div>
        <Skeleton className='h-3 w-28 bg-muted/40' />
        <div className='flex items-center justify-between pt-2.5 border-t border-border/50'>
          <Skeleton className='h-4 w-20 bg-muted/70' />
          <Skeleton className='h-3.5 w-14 rounded-full bg-muted/50' />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-6 w-full',
        className
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
