export function StoreCatalogSkeleton() {
  return (
    <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse'>
      <div className='space-y-4 py-4 border-b border-border/60'>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3'>
          <div className='h-9 max-w-md flex-1 rounded-md bg-muted' />
          <div className='h-9 w-28 rounded-md bg-muted' />
        </div>
        <div className='flex flex-wrap gap-1.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='h-8 w-20 rounded-full bg-muted' />
          ))}
        </div>
      </div>

      <div className='h-4 w-32 rounded bg-muted' />

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='overflow-hidden rounded-2xl border border-border/70 bg-card'
          >
            <div className='h-48 w-full bg-muted/60' />
            <div className='p-4 space-y-3'>
              <div className='h-3 w-24 rounded bg-muted' />
              <div className='h-4 w-full rounded bg-muted' />
              <div className='h-4 w-2/3 rounded bg-muted' />
              <div className='h-6 w-20 rounded bg-muted' />
              <div className='h-8 w-full rounded-md bg-muted' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
