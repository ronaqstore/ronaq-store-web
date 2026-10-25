import { cn } from '@/lib/utils';
import type {
  ProductGridSkeletonProps,
  ProductCardSkeletonProps,
  ResultsCountSkeletonProps,
  QuickFilterChipsSkeletonProps
} from '@/types/product';

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs animate-pulse motion-reduce:animate-none',
        className
      )}
      aria-hidden
    >
      <div className='relative aspect-square w-full shrink-0 overflow-hidden bg-muted/40' />

      <div className='flex flex-1 flex-col p-3 sm:p-4'>
        <div className='min-h-[1rem] mb-1'>
          <div className='h-2.5 w-12 rounded bg-muted/50' />
        </div>

        <div className='space-y-1.5 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem]'>
          <div className='h-3.5 w-full rounded bg-muted/60' />
          <div className='h-3.5 w-3/4 rounded bg-muted/60' />
        </div>

        <div className='h-3 w-2/3 rounded bg-muted/40 my-1.5' />

        <div className='mt-auto flex items-center justify-between gap-1.5 pt-2.5 border-t border-border/50'>
          <div className='h-5 w-16 rounded bg-muted/70' />
          <div className='h-3.5 w-14 rounded-full bg-muted/50' />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 lg:gap-6 w-full',
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

export function ResultsCountSkeleton({ className }: ResultsCountSkeletonProps) {
  return (
    <div
      className={cn(
        'h-4 w-36 rounded bg-muted/50 animate-pulse motion-reduce:animate-none',
        className
      )}
      aria-hidden
    />
  );
}

export function QuickFilterChipsSkeleton({ className }: QuickFilterChipsSkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto ps-4 pe-4 py-2 scrollbar-none animate-pulse motion-reduce:animate-none',
        className
      )}
      aria-hidden
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className='h-9 w-20 shrink-0 rounded-full bg-muted/40' />
      ))}
    </div>
  );
}
