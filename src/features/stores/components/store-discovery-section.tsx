import { STORES_PAGE_SIZE } from '@/constants/site';
import { getPublicStores } from '@/features/stores/api/service';
import { StoreDiscoveryFeed } from '@/features/stores/components/store-discovery-feed';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import type { StoreDiscoverySectionProps } from '@/types/store';

export async function StoreDiscoverySection({
  searchQuery,
  cityId
}: StoreDiscoverySectionProps) {
  const response = await getPublicStores({
    q: searchQuery || undefined,
    city: marketplaceCityQueryParam(cityId),
    page: 1,
    limit: STORES_PAGE_SIZE
  });

  const stores = response?.items ?? [];
  const total = response?.total ?? 0;
  const page = response?.page ?? 1;
  const totalPages = response?.totalPages ?? 1;

  return (
    <StoreDiscoveryFeed
      initialStores={stores}
      total={total}
      page={page}
      totalPages={totalPages}
      searchQuery={searchQuery}
      cityId={cityId}
    />
  );
}
