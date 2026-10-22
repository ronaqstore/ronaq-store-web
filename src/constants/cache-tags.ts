export const STORES_CACHE_TAG = 'stores';

export function storeCacheTag(slug: string): string {
  return `store:${slug}`;
}

export function storeProductsCacheTag(slug: string): string {
  return `store-products:${slug}`;
}
