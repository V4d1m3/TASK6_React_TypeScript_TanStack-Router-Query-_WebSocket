export function CategoryGridSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading categories"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    >
      {Array.from({ length: 10 }, (_, index) => (
        <li key={index}>
          <div className="h-[4.5rem] animate-pulse rounded-2xl border border-line bg-surface-muted" />
        </li>
      ))}
    </ul>
  )
}
