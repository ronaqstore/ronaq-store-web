import type { ApiResponse } from '@/types/common';

export function extractApiData<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }
  if (!('data' in payload)) return null;
  const data = (payload as ApiResponse<T>).data;
  return data ?? null;
}
