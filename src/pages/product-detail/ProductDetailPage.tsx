import { Link, useParams } from '@tanstack/react-router'
import { useProductQuery } from '@/entities/dummy-json/api/hooks'
import { ProductDetailsPanel } from '@/pages/product-detail/ui/ProductDetailsPanel'
import { ProductGallery } from '@/pages/product-detail/ui/ProductGallery'
import { formatCategoryLabel } from '@/shared/lib/format'
import { catalogSearchDefaults } from '@/shared/lib/catalog-search'
import { formatApiError } from '@/shared/lib/format-api-error'
import { StateMessage } from '@/shared/ui/StateMessage'

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const id = Number.parseInt(productId, 10)
  const { data: product, isLoading, isError, error } = useProductQuery(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <StateMessage title="Loading product…" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <StateMessage
          title="Product not found"
          message={formatApiError(error, 'Unable to load this product.')}
          tone="error"
        />
        <Link
          to="/catalog"
          search={catalogSearchDefaults}
          className="mt-4 inline-block text-brand hover:underline"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link to="/" className="hover:text-brand">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/catalog"
          search={{ category: product.category, page: 1, sort: 'title-asc', q: '' }}
          className="hover:text-brand"
        >
          {formatCategoryLabel(product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} thumbnail={product.thumbnail} />
        <ProductDetailsPanel product={product} />
      </div>
    </div>
  )
}
