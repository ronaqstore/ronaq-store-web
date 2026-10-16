import { API_BASE_URL } from '@/constants/api';
import type { ApiResponse } from '@/types/common';

export async function publicApiRequest<T>(endpoint: string): Promise<T | null> {
  if (!API_BASE_URL) return null;

  try {
    const url = `${API_BASE_URL}/public/${endpoint.replace(/^\/+/, '')}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as ApiResponse<T>;
    return json.data ?? null;
  } catch {
    return null;
  }
}
