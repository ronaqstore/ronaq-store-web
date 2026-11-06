'use client';

import { useTranslations } from 'next-intl';
import { ProductCard } from '@/components/products/product-card';
import { formatPrice } from '@/lib/formatters';
import type { ModelCardProps } from '@/types/product';

export function ModelCard({
  model,
  product,
  storeSlug,
  storeName,
  storeCity,
  priority = false
}: ModelCardProps) {
  const t = useTranslations();
  const priceLabelOverride = model.fromPrice
    ? t('catalog.fromPrice', { price: formatPrice(model.fromPrice) })
    : t('catalog.price');

  return (
    <ProductCard
      product={product}
      storeSlug={storeSlug}
      storeName={storeName}
      storeCity={storeCity}
      priority={priority}
      linkToModel
      priceLabelOverride={priceLabelOverride}
    />
  );
}
