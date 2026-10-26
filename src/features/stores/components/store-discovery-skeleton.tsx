export function StoreDiscoverySkeleton() {
  return (
    <div className='mx-auto w-full max-w-7xl 2xl:max-w-[1440px] space-y-6 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='space-y-2 border-b border-border/40 pb-4'>
        <div className='h-7 w-40 rounded bg-muted motion-reduce:animate-none animate-pulse' />
        <div className='h-3 w-56 rounded bg-muted motion-reduce:animate-none animate-pulse' />
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6 2xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card'
          >
            <div className='aspect-[16/7] w-full bg-muted motion-reduce:animate-none animate-pulse' />
            <div className='relative -mt-6 flex flex-1 flex-col px-3 pb-3 md:px-4 md:pb-4'>
              <div className='mb-2 h-12 w-12 rounded-full border-2 border-background bg-muted ring-2 ring-background md:h-14 md:w-14 motion-reduce:animate-none animate-pulse' />
              <div className='h-5 w-2/3 rounded bg-muted motion-reduce:animate-none animate-pulse' />
              <div className='mt-2 h-3 w-1/2 rounded bg-muted motion-reduce:animate-none animate-pulse' />
              <div className='mt-2 h-5 w-28 rounded-full bg-muted motion-reduce:animate-none animate-pulse' />
              <div className='mt-2 h-3 w-24 rounded bg-muted motion-reduce:animate-none animate-pulse' />
              <div className='mt-auto flex gap-2 pt-3'>
                <div className='h-11 flex-1 rounded-xl bg-muted motion-reduce:animate-none animate-pulse' />
                <div className='h-11 w-11 rounded-xl bg-muted motion-reduce:animate-none animate-pulse' />
                <div className='h-11 w-11 rounded-xl bg-muted motion-reduce:animate-none animate-pulse' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
