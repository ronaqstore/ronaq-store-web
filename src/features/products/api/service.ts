import { publicApiRequest } from '@/lib/api/client';
import type {
  StoreCategory,
  ProductListQuery,
  PaginatedProductsResponse,
  StoreProductDetail
} from '@/types/product';

export async function getStoreCategories(slug: string): Promise<StoreCategory[] | null> {
  return publicApiRequest<StoreCategory[]>(`stores/${slug}/categories`);
}

export async function getStoreProducts(
  slug: string,
  query: ProductListQuery = {}
): Promise<PaginatedProductsResponse | null> {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.categoryId) params.set('categoryId', query.categoryId);
  if (typeof query.inStock === 'boolean') params.set('inStock', String(query.inStock));
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const qs = params.toString() ? `?${params.toString()}` : '';
  return publicApiRequest<PaginatedProductsResponse>(`stores/${slug}/products${qs}`);
}

export async function getStoreProductDetail(
  slug: string,
  productId: string
): Promise<StoreProductDetail | null> {
  return publicApiRequest<StoreProductDetail>(`stores/${slug}/products/${productId}`);
}
