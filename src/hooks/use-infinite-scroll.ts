'use client';

import { useEffect, useRef } from 'react';

export function useInfiniteScroll(hasMore: boolean, onLoadMore: () => void, rootMargin = '320px 0px') {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, rootMargin]);

  return sentinelRef;
}
