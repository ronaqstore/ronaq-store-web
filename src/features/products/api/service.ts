import { cache } from 'react';
import { publicApiRequest } from '@/lib/api/client';
import {
  mapCategoriesResponse,
  mapProductDetail,
  mapProductsResponse,
  mapStoreModelDetail,
  mapStoreModels
} from '@/lib/api/mappers';
import { storeCacheTag, storeProductsCacheTag } from '@/constants/cache-tags';
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/site';
import { extractProductId } from '@/lib/seo/slug';
import type {
  StoreCategory,
  ProductListQuery,
  PaginatedProductsResponse,
  StoreProductDetail,
  StoreModelDetail,
  StoreModelListItem
} from '@/types/product';
import type {
  ApiCategoriesResponse,
  ApiPaginatedProducts,
  ApiProduct,
  ApiStoreModel,
  ApiStoreModelDetail
} from '@/types/api';
import type { PublicFetchCache } from '@/types/common';

function storefrontCache(slug: string): PublicFetchCache {
  return {
    revalidate: PUBLIC_REVALIDATE_SECONDS,
    tags: [storeCacheTag(slug), storeProductsCacheTag(slug)]
  };
}

export const getStoreCategories = cache(async (slug: string): Promise<StoreCategory[] | null> => {
  const raw = await publicApiRequest<ApiCategoriesResponse>(
    `stores/${slug}/categories`,
    storefrontCache(slug)
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
    storefrontCache(slug)
  );
  return mapProductsResponse(raw);
}

export const getStoreProductDetail = cache(
  async (slug: string, productKey: string): Promise<StoreProductDetail | null> => {
    const productId = extractProductId(productKey);
    const raw = await publicApiRequest<ApiProduct>(
      `stores/${slug}/products/${productId}`,
      storefrontCache(slug)
    );
    return mapProductDetail(raw);
  }
);

export const getStoreModels = cache(async (slug: string): Promise<StoreModelListItem[]> => {
  const raw = await publicApiRequest<ApiStoreModel[]>(
    `stores/${slug}/models`,
    storefrontCache(slug)
  );
  return mapStoreModels(raw);
});

export const getStoreModelDetail = cache(
  async (slug: string, modelKey: string): Promise<StoreModelDetail | null> => {
    const encoded = encodeURIComponent(modelKey);
    const raw = await publicApiRequest<ApiStoreModelDetail>(
      `stores/${slug}/models/${encoded}`,
      storefrontCache(slug)
    );
    return mapStoreModelDetail(raw);
  }
);
