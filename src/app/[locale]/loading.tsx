import { ProductGridSkeleton, QuickFilterChipsSkeleton, ResultsCountSkeleton } from '@/components/products/product-grid-skeleton';

export default function LocaleLoading() {
  return (
    <div className='min-w-0 animate-pulse motion-reduce:animate-none' aria-busy='true'>
      <div className='border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-background py-6 sm:py-8 md:py-10 lg:py-12'>
        <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-3'>
          <div className='h-8 sm:h-10 md:h-12 w-3/4 max-w-xl rounded-xl bg-muted/60' />
          <div className='h-4 w-full max-w-md rounded-lg bg-muted/40 hidden min-[360px]:block' />
        </div>
      </div>

      <div className='sticky top-14 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl'>
        <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2.5'>
          <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
            <div className='h-12 w-full max-w-2xl rounded-xl bg-muted/50' />
            <div className='flex gap-2 shrink-0'>
              <div className='h-12 w-32 rounded-xl bg-muted/40' />
              <div className='h-12 w-28 rounded-xl bg-muted/40' />
            </div>
          </div>
          <QuickFilterChipsSkeleton />
        </div>
      </div>

      <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6'>
        <div className='flex items-end justify-between border-b border-border/40 pb-4'>
          <div className='space-y-2'>
            <div className='h-7 w-48 rounded-lg bg-muted/60' />
            <div className='h-4 w-32 rounded bg-muted/40' />
          </div>
          <div className='h-10 w-28 rounded-xl bg-muted/40' />
        </div>

        <ResultsCountSkeleton />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
