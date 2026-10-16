export default function LocaleLoading() {
  return (
    <div className='animate-pulse'>
      <div className='relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6'>
          <div className='mx-auto h-10 sm:h-14 w-3/4 max-w-xl rounded-lg bg-muted' />
          <div className='mx-auto h-4 w-full max-w-md rounded bg-muted' />
          <div className='mx-auto h-13 w-full max-w-3xl rounded-2xl bg-muted' />
        </div>
      </div>

      <div className='mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 space-y-6'>
        <div className='space-y-2'>
          <div className='h-7 w-40 rounded bg-muted' />
          <div className='h-3 w-24 rounded bg-muted' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='overflow-hidden rounded-2xl border border-border/70 bg-card'
            >
              <div className='h-36 w-full bg-muted/60' />
              <div className='p-4 space-y-3'>
                <div className='h-4 w-2/3 rounded bg-muted' />
                <div className='h-3 w-full rounded bg-muted' />
                <div className='h-3 w-4/5 rounded bg-muted' />
                <div className='h-8 w-full rounded-md bg-muted' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
