import { ProductGridSkeleton, ResultsCountSkeleton } from '@/components/products/product-grid-skeleton';

export function MarketplaceSkeleton() {
  return (
    <div className='space-y-4 sm:space-y-6 w-full' aria-busy='true'>
      <ResultsCountSkeleton />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
