import { cache } from 'react';
import { publicApiRequest } from '@/lib/api/client';
import { mapMarketplaceProductsResponse } from '@/lib/api/mappers';
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/site';
import { marketplaceCityQueryParam } from '@/lib/city-preference';
import { MARKETPLACE_SEARCH_MAX_LEN } from '@/lib/marketplace-filters';
import { trackMarketplaceProductsRequest } from '@/lib/marketplace-request-log';
import type {
  ApiMarketplaceModelsResponse,
  ApiPaginatedMarketplaceHubs,
  ApiPaginatedMarketplaceProducts,
  MarketplaceHub,
  MarketplaceHubsPage,
  MarketplaceHubsQuery,
  MarketplaceModelsResponse,
  MarketplaceModelsSearchQuery,
  MarketplaceModelSuggestion,
  MarketplaceProductListQuery,
  PaginatedMarketplaceProducts
} from '@/types/marketplace';

const HUBS_PAGE_SIZE = 20;

function mapHubsPage(
  raw: ApiPaginatedMarketplaceHubs | null,
  fallbackPage = 1,
  fallbackLimit = HUBS_PAGE_SIZE
): MarketplaceHubsPage {
  const items = Array.isArray(raw?.items) ? raw.items : [];
  const pageSize = raw?.pageSize ?? raw?.limit ?? fallbackLimit;
  const total = raw?.total ?? items.length;
  return {
    items,
    total,
    page: raw?.page ?? fallbackPage,
    limit: pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1
  };
}

export async function getMarketplaceHubsPage(
  query: MarketplaceHubsQuery = {}
): Promise<MarketplaceHubsPage> {
  const page = query.page ?? 1;
  const limit = query.limit ?? HUBS_PAGE_SIZE;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });
  if (query.q?.trim()) params.set('q', query.q.trim());

  const raw = await publicApiRequest<ApiPaginatedMarketplaceHubs>(
    `marketplace/hubs?${params.toString()}`,
    { cache: 'no-store' }
  );
  return mapHubsPage(raw, page, limit);
}

export const getMarketplaceHubLabel = cache(
  async (cityId: string | null | undefined): Promise<string | null> => {
    if (!cityId || cityId === 'all' || cityId.startsWith('area:')) return null;
    const page = await getMarketplaceHubsPage({ q: cityId, limit: 50 });
    return page.items.find((hub) => hub.id === cityId)?.name ?? null;
  }
);

export async function getMarketplaceProducts(
  query: MarketplaceProductListQuery = {}
): Promise<PaginatedMarketplaceProducts | null> {
  const params = new URLSearchParams();
  const city = marketplaceCityQueryParam(query.city);
  if (city) params.set('city', city);
  if (query.modelKey) params.set('modelKey', query.modelKey.slice(0, 160));
  else if (query.q) params.set('q', query.q.slice(0, MARKETPLACE_SEARCH_MAX_LEN));
  if (query.category) params.set('category', query.category);
  if (query.brand) params.set('brand', query.brand);
  if (typeof query.inStock === 'boolean') params.set('inStock', String(query.inStock));
  if (query.condition) params.set('condition', query.condition);
  if (typeof query.minPrice === 'number') params.set('minPrice', String(query.minPrice));
  if (typeof query.maxPrice === 'number') params.set('maxPrice', String(query.maxPrice));
  if (query.ptaStatus) params.set('ptaStatus', query.ptaStatus);
  if (query.authenticity) params.set('authenticity', query.authenticity);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const paramRecord: Record<string, string> = {};
  params.forEach((value, key) => {
    paramRecord[key] = value;
  });
  trackMarketplaceProductsRequest('ssr', paramRecord);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const raw = await publicApiRequest<ApiPaginatedMarketplaceProducts>(
    `marketplace/products${qs}`,
    { cache: 'no-store' }
  );
  return mapMarketplaceProductsResponse(raw);
}

export async function searchMarketplaceModels(
  query: MarketplaceModelsSearchQuery
): Promise<MarketplaceModelsResponse> {
  const q = query.q.trim();
  if (q.length < 2) return { items: [], total: 0 };

  const params = new URLSearchParams({
    q,
    limit: String(query.limit ?? 8)
  });
  const city = marketplaceCityQueryParam(query.city);
  if (city) params.set('city', city);

  const raw = await publicApiRequest<ApiMarketplaceModelsResponse>(
    `marketplace/models?${params.toString()}`,
    { cache: 'no-store' },
    query.signal
  );

  const items: MarketplaceModelSuggestion[] = (raw?.items ?? [])
    .filter((item) => item?.modelKey && item.title)
    .map((item) => ({
      modelKey: item.modelKey as string,
      brand: item.brand ?? '',
      model: item.model ?? '',
      title: item.title as string,
      count: item.count ?? 0,
      imageUrl: item.imageUrl ?? null,
      minPrice: item.minPrice ?? null
    }));

  return { items, total: raw?.total ?? items.length };
}

export async function resolveNearestHub(
  latitude: number,
  longitude: number
): Promise<MarketplaceHub | null> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude)
  });
  return publicApiRequest<MarketplaceHub>(`marketplace/hubs/nearest?${params.toString()}`, {
    cache: 'no-store'
  });
}

export async function getMarketplaceRelatedProducts(
  productId: string,
  cityId?: string | null,
  limit = 8
): Promise<PaginatedMarketplaceProducts | null> {
  if (!productId.trim()) return null;
  const params = new URLSearchParams({
    productId: productId.trim(),
    limit: String(Math.min(Math.max(limit, 1), 24))
  });
  const city = marketplaceCityQueryParam(cityId);
  if (city) params.set('city', city);

  const raw = await publicApiRequest<ApiPaginatedMarketplaceProducts>(
    `marketplace/related-products?${params.toString()}`,
    {
      revalidate: PUBLIC_REVALIDATE_SECONDS,
      tags: ['marketplace-related', `marketplace-related-${productId}`]
    }
  );
  return mapMarketplaceProductsResponse(raw);
}
