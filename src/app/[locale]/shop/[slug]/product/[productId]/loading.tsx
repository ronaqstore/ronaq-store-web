export default function ProductLoading() {
  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse'>
      <div className='h-9 w-36 rounded-md bg-muted' />

      <div className='rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6'>
        <div className='h-72 sm:h-96 w-full rounded-2xl bg-muted/60' />

        <div className='space-y-3'>
          <div className='flex flex-wrap gap-2'>
            <div className='h-6 w-20 rounded-full bg-muted' />
            <div className='h-6 w-16 rounded-full bg-muted' />
            <div className='h-6 w-16 rounded-full bg-muted' />
          </div>
          <div className='h-9 w-3/4 rounded bg-muted' />
          <div className='h-10 w-32 rounded bg-muted' />
          <div className='space-y-2 pt-2 border-t border-border/50'>
            <div className='h-3 w-24 rounded bg-muted' />
            <div className='h-4 w-full rounded bg-muted' />
            <div className='h-4 w-5/6 rounded bg-muted' />
          </div>
          <div className='grid grid-cols-2 gap-3 pt-3'>
            <div className='h-12 rounded-lg bg-muted/60' />
            <div className='h-12 rounded-lg bg-muted/60' />
          </div>
        </div>

        <div className='h-12 w-full rounded-md bg-muted' />
      </div>
    </div>
  );
}
