import { cn } from '@/lib/utils';
import type { SkeletonProps } from '@/types/media';

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      aria-hidden
      {...props}
    />
  );
}
