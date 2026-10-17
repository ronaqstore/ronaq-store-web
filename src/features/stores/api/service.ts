import { cache } from 'react';
import { publicApiRequest } from '@/lib/api/client';
import { mapStoreProfile, mapStoresResponse } from '@/lib/api/mappers';
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/site';
import type {
  StoreListQuery,
  PaginatedStoresResponse,
  StoreProfile
} from '@/types/store';
import type { ApiPaginatedStores, ApiStore } from '@/types/api';
import type { PublicFetchCache } from '@/types/common';

const PUBLIC_CACHE: PublicFetchCache = { revalidate: PUBLIC_REVALIDATE_SECONDS };

export async function getPublicStores(
  query: StoreListQuery = {}
): Promise<PaginatedStoresResponse | null> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.city) params.set('city', query.city);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const qs = params.toString() ? `?${params.toString()}` : '';
  const raw = await publicApiRequest<ApiPaginatedStores>(`stores${qs}`, PUBLIC_CACHE);
  return mapStoresResponse(raw);
}

export const getPublicStoreProfile = cache(async (slug: string): Promise<StoreProfile | null> => {
  const raw = await publicApiRequest<ApiStore>(`stores/${slug}`, PUBLIC_CACHE);
  return mapStoreProfile(raw);
});
