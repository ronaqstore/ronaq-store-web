import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';

export default function ProductLoading() {
  return (
    <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-12 space-y-8 md:space-y-10 lg:space-y-14 animate-pulse'>
      <div className='h-5 w-32 rounded bg-muted/60 mb-4' />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 2xl:gap-12 items-start'>
        <div className='lg:col-span-7 space-y-3 min-w-0'>
          <div className='aspect-square w-full rounded-2xl sm:rounded-3xl bg-muted/50' />
          <div className='hidden sm:flex gap-2.5'>
            <div className='h-18 w-18 rounded-xl bg-muted/40' />
            <div className='h-18 w-18 rounded-xl bg-muted/40' />
            <div className='h-18 w-18 rounded-xl bg-muted/40' />
          </div>
        </div>

        <div className='lg:col-span-5 min-w-0'>
          <div className='rounded-3xl border border-border/80 bg-card p-4 md:p-5 lg:p-6 space-y-5 shadow-xs'>
            <div className='h-3 w-44 rounded bg-muted/50' />

            <div className='space-y-2'>
              <div className='h-3 w-16 rounded bg-muted/60' />
              <div className='h-8 w-4/5 rounded bg-muted/80' />
            </div>

            <div className='flex gap-2'>
              <div className='h-6 w-20 rounded-md bg-muted/50' />
              <div className='h-6 w-24 rounded-md bg-muted/50' />
              <div className='h-6 w-16 rounded-md bg-muted/50' />
            </div>

            <div className='h-20 rounded-2xl bg-muted/30 p-4' />

            <div className='flex gap-2 pt-1'>
              <div className='h-8 w-24 rounded-xl bg-muted/40' />
              <div className='h-8 w-24 rounded-xl bg-muted/40' />
            </div>

            <div className='space-y-2 pt-2'>
              <div className='h-12 w-full rounded-xl bg-muted/60' />
              <div className='h-12 w-full rounded-xl bg-muted/40' />
            </div>

            <div className='h-16 rounded-2xl bg-muted/20' />

            <div className='h-18 rounded-2xl bg-muted/30' />
          </div>
        </div>
      </div>

      <div className='rounded-3xl border border-border/80 bg-card p-6 space-y-4'>
        <div className='flex gap-4 border-b border-border/60 pb-3'>
          <div className='h-6 w-24 rounded bg-muted/60' />
          <div className='h-6 w-24 rounded bg-muted/40' />
          <div className='h-6 w-24 rounded bg-muted/40' />
        </div>
        <div className='space-y-3 pt-2'>
          <div className='h-10 w-full rounded-lg bg-muted/20' />
          <div className='h-10 w-full rounded-lg bg-muted/30' />
          <div className='h-10 w-full rounded-lg bg-muted/20' />
          <div className='h-10 w-full rounded-lg bg-muted/30' />
        </div>
      </div>

      <div className='space-y-4 pt-4'>
        <div className='flex items-center justify-between'>
          <div className='h-7 w-48 rounded bg-muted/60' />
          <div className='h-4 w-36 rounded bg-muted/40' />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
