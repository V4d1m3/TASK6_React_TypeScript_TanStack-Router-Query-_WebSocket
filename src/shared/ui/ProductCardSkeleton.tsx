export function ProductCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-raised shadow-sm"
    >
      <div className="aspect-square animate-pulse bg-surface-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
          <div className="h-4 w-[80%] animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="space-y-2">
            <div className="h-5 w-20 animate-pulse rounded bg-surface-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="h-9 w-14 animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      </div>
    </article>
  )
}
