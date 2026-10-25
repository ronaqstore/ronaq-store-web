'use client';

import { ProductCard } from './product-card';
import type { MarketplaceProductCardProps } from '@/types/marketplace';

export function MarketplaceProductCard({
  product,
  priority = false,
  prefetch = false
}: MarketplaceProductCardProps) {
  return <ProductCard product={product} priority={priority} prefetch={prefetch} />;
}
