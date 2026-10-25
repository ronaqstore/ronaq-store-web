import { API_BASE_URL } from '@/constants/api';
import { PUBLIC_REVALIDATE_SECONDS } from '@/constants/site';
import { extractApiData } from '@/lib/api/envelope';
import type { PublicFetchCache } from '@/types/common';

const DEFAULT_CACHE: PublicFetchCache = { revalidate: PUBLIC_REVALIDATE_SECONDS };

export async function publicApiRequest<T>(
  endpoint: string,
  cache: PublicFetchCache = DEFAULT_CACHE,
  signal?: AbortSignal
): Promise<T | null> {
  if (!API_BASE_URL) return null;

  try {
    const url = `${API_BASE_URL}/public/${endpoint.replace(/^\/+/, '')}`;
    const nextOptions =
      'cache' in cache
        ? {
            cache: cache.cache,
            ...(cache.tags && cache.tags.length > 0 ? { next: { tags: cache.tags } } : {})
          }
        : {
            next: {
              revalidate: cache.revalidate,
              ...(cache.tags && cache.tags.length > 0 ? { tags: cache.tags } : {})
            }
          };

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal,
      ...nextOptions
    });

    if (!response.ok) {
      return null;
    }

    const json: unknown = await response.json();
    return extractApiData<T>(json);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}
