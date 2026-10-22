'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function useDebouncedUrlSearch(urlSearch: string, delayMs = 400) {
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchQuery, delayMs);
  const pushedQueryRef = useRef(urlSearch);
  const debouncedQuery = debouncedSearch.trim();

  useEffect(() => {
    if (urlSearch === pushedQueryRef.current) return;
    pushedQueryRef.current = urlSearch;
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (debouncedQuery === urlSearch) {
      pushedQueryRef.current = debouncedQuery;
    }
  }, [debouncedQuery, urlSearch]);

  const markUrlSync = useCallback((query: string) => {
    pushedQueryRef.current = query;
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    shouldSyncUrl: debouncedQuery !== urlSearch,
    markUrlSync
  };
}
