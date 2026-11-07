'use client';

import { ProductCard } from './product-card';
import type { MarketplaceProductCardProps } from '@/types/marketplace';

export function MarketplaceProductCard({
  product,
  priority = false,
  prefetch = false
}: MarketplaceProductCardProps) {
  return (
    <ProductCard
      product={product}
      priority={priority}
      prefetch={prefetch}
      imageSizes='(max-width:639px) calc(50vw - 1.125rem), (max-width:1023px) calc(33.333vw - 1rem), (max-width:1535px) calc(min(25vw, 20rem) - 1.125rem), calc(min(20vw, 18rem) - 1.6rem)'
    />
  );
}
