import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-elevated animate-pulse rounded-lg',
        className
      )}
    />
  )
}

export function MangaCardSkeleton() {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function ChapterCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border">
      <Skeleton className="w-12 h-12 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
