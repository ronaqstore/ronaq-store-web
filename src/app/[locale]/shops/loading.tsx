import { StoreDiscoverySkeleton } from '@/features/stores/components/store-discovery-skeleton';

export default function ShopsLoading() {
  return (
    <div className='min-w-0'>
      <div className='border-b border-border/60 bg-gradient-to-b from-primary/10 via-primary/5 to-background py-6 sm:py-8 md:py-10'>
        <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] space-y-3 px-4 sm:px-6 lg:px-8'>
          <div className='h-3 w-24 rounded bg-muted motion-reduce:animate-none animate-pulse' />
          <div className='h-8 w-64 max-w-full rounded bg-muted motion-reduce:animate-none animate-pulse sm:h-10' />
          <div className='h-4 w-full max-w-xl rounded bg-muted motion-reduce:animate-none animate-pulse' />
        </div>
      </div>
      <div className='sticky top-[var(--app-bar-h)] z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl'>
        <div className='mx-auto flex w-full max-w-7xl 2xl:max-w-[1440px] flex-col gap-2.5 px-4 py-3 sm:flex-row sm:px-6 lg:px-8'>
          <div className='h-12 min-h-12 flex-1 rounded-xl bg-muted motion-reduce:animate-none animate-pulse' />
          <div className='h-12 min-h-12 w-full rounded-xl bg-muted motion-reduce:animate-none animate-pulse sm:max-w-52' />
        </div>
      </div>
      <StoreDiscoverySkeleton />
    </div>
  );
}
