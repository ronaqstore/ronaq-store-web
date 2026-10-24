export function MarketplaceSkeleton() {
  return (
    <div className='space-y-3 animate-pulse'>
      <div className='h-3 w-28 rounded bg-muted' />
      <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='overflow-hidden rounded-xl border border-border/70 bg-card'
          >
            <div className='aspect-square w-full bg-muted/60 sm:aspect-[4/3]' />
            <div className='space-y-2 p-3 sm:p-3.5'>
              <div className='h-2.5 w-16 rounded bg-muted' />
              <div className='h-4 w-4/5 rounded bg-muted' />
              <div className='h-3 w-3/5 rounded bg-muted' />
              <div className='mt-2 flex items-center justify-between gap-2'>
                <div className='h-5 w-16 rounded bg-muted' />
                <div className='h-4 w-12 rounded bg-muted' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
