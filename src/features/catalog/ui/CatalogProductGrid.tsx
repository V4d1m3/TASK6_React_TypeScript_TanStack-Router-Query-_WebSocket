import type { ProductListItem } from '@/entities/dummy-json/model/types'
import { formatCategoryLabel } from '@/shared/lib/format'
import { CATALOG_VIEW_ALL, type CatalogSearch } from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'
import { ProductCard } from '@/shared/ui/ProductCard'
import { StateMessage } from '@/shared/ui/StateMessage'

type CatalogProductGridProps = {
  search: CatalogSearch
  category: string
  products: ProductListItem[]
  total: number
  rangeStart: number
  rangeEnd: number
  totalPages: number
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onPageChange: (page: number) => void
}

export function CatalogProductGrid({
  search,
  category,
  products,
  total,
  rangeStart,
  rangeEnd,
  totalPages,
  isLoading,
  isError,
  errorMessage,
  onPageChange,
}: CatalogProductGridProps) {
  if (isLoading) {
    return <StateMessage title="Loading products…" />
  }

  if (isError) {
    return (
      <StateMessage
        title="Could not load products"
        message={errorMessage}
        tone="error"
      />
    )
  }

  return (
    <>
      <p className="mb-4 text-sm text-ink-muted">
        Showing {rangeStart}–{rangeEnd} of {total}
        {search.q ? ` for “${search.q}”` : ''}
        {category !== CATALOG_VIEW_ALL
          ? ` in ${formatCategoryLabel(category)}`
          : ''}
      </p>

      {products.length === 0 ? (
        <StateMessage
          title="No products found"
          message="Try another search or category."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                imageLoading={index < 4 ? 'eager' : 'lazy'}
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            disabled={search.page <= 1}
            onClick={() => onPageChange(search.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-ink-muted">
            Page {search.page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={search.page >= totalPages}
            onClick={() => onPageChange(search.page + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </>
  )
}
