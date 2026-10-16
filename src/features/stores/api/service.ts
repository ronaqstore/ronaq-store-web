import { publicApiRequest } from '@/lib/api/client';
import type {
  StoreListQuery,
  PaginatedStoresResponse,
  StoreProfile
} from '@/types/store';

export async function getPublicStores(
  query: StoreListQuery = {}
): Promise<PaginatedStoresResponse | null> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.city) params.set('city', query.city);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const qs = params.toString() ? `?${params.toString()}` : '';
  return publicApiRequest<PaginatedStoresResponse>(`stores${qs}`);
}

export async function getPublicStoreProfile(slug: string): Promise<StoreProfile | null> {
  return publicApiRequest<StoreProfile>(`stores/${slug}`);
}
