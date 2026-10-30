import { PRODUCTS_PAGE_SIZE } from '@/constants/site';
import { getMarketplaceProducts } from '@/features/marketplace/api/service';
import { MarketplaceProductFeed } from '@/features/marketplace/components/marketplace-product-feed';
import { toPaisaFromRs } from '@/lib/marketplace-filters';
import type { MarketplaceSectionProps } from '@/types/marketplace';

export async function MarketplaceSection({
  searchQuery,
  modelKey,
  cityId,
  filters
}: MarketplaceSectionProps) {
  const response = await getMarketplaceProducts({
    q: modelKey ? undefined : searchQuery || undefined,
    modelKey: modelKey || undefined,
    city: cityId,
    condition: filters.condition,
    minPrice:
      filters.minPriceRs != null && filters.minPriceRs > 0
        ? toPaisaFromRs(filters.minPriceRs)
        : undefined,
    maxPrice:
      filters.maxPriceRs != null && filters.maxPriceRs > 0
        ? toPaisaFromRs(filters.maxPriceRs)
        : undefined,
    inStock: filters.inStock,
    ptaStatus: filters.ptaStatus,
    authenticity: filters.authenticity,
    sort: filters.sort,
    category: filters.category,
    page: 1,
    limit: PRODUCTS_PAGE_SIZE
  });

  const fetchFailed = response == null;
  const products = response?.items ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const totalPages = response?.totalPages ?? 1;

  return (
    <MarketplaceProductFeed
      initialProducts={products}
      total={total}
      page={page}
      totalPages={totalPages}
      searchQuery={searchQuery}
      modelKey={modelKey}
      cityId={cityId}
      filters={filters}
      initialFetchFailed={fetchFailed}
    />
  );
}
