import { ProductCardSkeleton } from '@/shared/ui/ProductCardSkeleton'

type ProductGridSkeletonProps = {
  count?: number
  className?: string
}

export function ProductGridSkeleton({
  count = 8,
  className = '',
}: ProductGridSkeletonProps) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading products"
      className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`.trim()}
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <ProductCardSkeleton />
        </li>
      ))}
    </ul>
  )
}
