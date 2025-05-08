// src/components/ui/skeleton.tsx
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton loader genérico.
 * Úsalo así: <Skeleton className="h-6 w-1/2 rounded" />
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-muted animate-pulse ${className}`}
      {...props}
    />
  );
}
