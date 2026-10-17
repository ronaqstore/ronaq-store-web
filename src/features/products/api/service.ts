import { cache } from 'react';
import { publicApiRequest } from '@/lib/api/client';
import {
  mapCategoriesResponse,
  mapProductDetail,
  mapProductsResponse
} from '@/lib/api/mappers';
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/site';
import { extractProductId } from '@/lib/seo/slug';
import type {
  StoreCategory,
  ProductListQuery,
  PaginatedProductsResponse,
  StoreProductDetail
} from '@/types/product';
import type { ApiCategoriesResponse, ApiPaginatedProducts, ApiProduct } from '@/types/api';
import type { PublicFetchCache } from '@/types/common';

const PUBLIC_CACHE: PublicFetchCache = { revalidate: PUBLIC_REVALIDATE_SECONDS };

export const getStoreCategories = cache(async (slug: string): Promise<StoreCategory[] | null> => {
  const raw = await publicApiRequest<ApiCategoriesResponse>(
    `stores/${slug}/categories`,
    PUBLIC_CACHE
  );
  return mapCategoriesResponse(raw);
});

export async function getStoreProducts(
  slug: string,
  query: ProductListQuery = {}
): Promise<PaginatedProductsResponse | null> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.category) params.set('category', query.category);
  if (typeof query.inStock === 'boolean') params.set('inStock', String(query.inStock));
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const qs = params.toString() ? `?${params.toString()}` : '';
  const raw = await publicApiRequest<ApiPaginatedProducts>(
    `stores/${slug}/products${qs}`,
    PUBLIC_CACHE
  );
  return mapProductsResponse(raw);
}

export const getStoreProductDetail = cache(
  async (slug: string, productKey: string): Promise<StoreProductDetail | null> => {
    const productId = extractProductId(productKey);
    const raw = await publicApiRequest<ApiProduct>(
      `stores/${slug}/products/${productId}`,
      PUBLIC_CACHE
    );
    return mapProductDetail(raw);
  }
);
