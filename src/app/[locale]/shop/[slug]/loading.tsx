import { StoreCatalogSkeleton } from '@/features/stores/components/store-catalog-skeleton';

export default function ShopLoading() {
  return (
    <div className='animate-pulse'>
      <div className='relative overflow-hidden border-b border-border/70'>
        <div className='h-40 sm:h-52 w-full bg-muted/50' />
        <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8'>
          <div className='relative -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-end gap-4'>
              <div className='h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-muted border-4 border-background shrink-0' />
              <div className='space-y-2 pb-1'>
                <div className='h-8 w-48 sm:w-64 rounded bg-muted' />
                <div className='h-4 w-40 rounded bg-muted' />
                <div className='h-3 w-72 max-w-full rounded bg-muted' />
              </div>
            </div>
            <div className='flex gap-2.5'>
              <div className='h-10 w-28 rounded-md bg-muted' />
              <div className='h-10 w-32 rounded-md bg-muted' />
            </div>
          </div>
        </div>
      </div>

      <StoreCatalogSkeleton />
    </div>
  );
}
