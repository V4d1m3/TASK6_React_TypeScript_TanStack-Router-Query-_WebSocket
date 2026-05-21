import { ProductGridSkeleton } from '@/shared/ui/ProductGridSkeleton'

export function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3" aria-hidden>
        <div className="h-9 w-40 animate-pulse rounded-lg bg-surface-muted" />
        <div className="h-5 w-72 max-w-full animate-pulse rounded bg-surface-muted" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  )
}