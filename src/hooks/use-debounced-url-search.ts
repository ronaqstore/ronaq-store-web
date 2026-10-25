'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function useDebouncedUrlSearch(urlSearch: string, delayMs = 400) {
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [lastSyncedQuery, setLastSyncedQuery] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchQuery, delayMs);
  const debouncedQuery = debouncedSearch.trim();

  useEffect(() => {
    if (urlSearch !== lastSyncedQuery) {
      setLastSyncedQuery(urlSearch);
      setSearchQuery(urlSearch);
    }
  }, [urlSearch, lastSyncedQuery]);

  const markUrlSync = useCallback((query: string) => {
    setLastSyncedQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    shouldSyncUrl: debouncedQuery !== lastSyncedQuery,
    markUrlSync
  };
}
