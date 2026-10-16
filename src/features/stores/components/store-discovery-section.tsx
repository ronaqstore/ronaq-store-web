import { getPublicStores } from '@/features/stores/api/service';
import { StoreDiscoveryResults } from '@/features/stores/components/store-discovery-results';
import type { StoreDiscoverySectionProps } from '@/types/store';

export async function StoreDiscoverySection({ searchQuery }: StoreDiscoverySectionProps) {
  const response = await getPublicStores({
    q: searchQuery || undefined,
    limit: 50
  });

  const stores = response?.items ?? [];

  return <StoreDiscoveryResults stores={stores} />;
}
