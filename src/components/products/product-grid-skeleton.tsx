import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ProductGridSkeletonProps } from '@/types/product';

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4',
        className
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className='overflow-hidden rounded-xl border border-border/80 bg-card sm:rounded-2xl'
        >
          <Skeleton className='aspect-square w-full rounded-none sm:aspect-[4/3]' />
          <div className='space-y-2 p-3 sm:p-3.5'>
            <Skeleton className='h-2.5 w-16' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='mt-2 h-5 w-24' />
          </div>
        </div>
      ))}
    </div>
  );
}
