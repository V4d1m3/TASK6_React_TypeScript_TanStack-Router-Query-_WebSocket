import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useProductQuery } from '@/entities/dummy-json/api/hooks'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatCategoryLabel, formatPrice } from '@/shared/lib/format'
import { catalogSearchDefaults } from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'
import { StateMessage } from '@/shared/ui/StateMessage'

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const id = Number.parseInt(productId, 10)
  const { data: product, isLoading, isError, error } = useProductQuery(id)
  const { addItem, removeItem, isInCart } = useCart()
  const [imageIndex, setImageIndex] = useState(0)

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
          message={error?.message}
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

  const images =
    product.images.length > 0 ? product.images : [product.thumbnail]
  const activeImage = images[imageIndex] ?? product.thumbnail
  const inCart = isInCart(product.id)
  const isOutOfStock = product.availabilityStatus === 'Out of Stock'

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
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-line bg-surface-muted">
            <img
              src={activeImage}
              alt=""
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 ? (
            <ul className="flex flex-wrap gap-2">
              {images.map((src, index) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setImageIndex(index)}
                    className={`overflow-hidden rounded-xl border-2 ${
                      index === imageIndex ? 'border-brand' : 'border-transparent'
                    }`}
                  >
                    <img src={src} alt="" className="h-16 w-16 object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              {product.brand}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">{product.title}</h1>
            <p className="mt-3 text-3xl font-bold text-brand">{formatPrice(product.price)}</p>
            {product.discountPercentage > 0 ? (
              <p className="text-sm text-accent">
                {product.discountPercentage}% off
              </p>
            ) : null}
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-surface-muted px-3 py-2">
              <dt className="text-ink-muted">Rating</dt>
              <dd className="font-semibold text-ink">★ {product.rating}</dd>
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-2">
              <dt className="text-ink-muted">Stock</dt>
              <dd className="font-semibold text-ink">{product.stock}</dd>
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-2">
              <dt className="text-ink-muted">Status</dt>
              <dd className="font-semibold text-ink">{product.availabilityStatus}</dd>
            </div>
            <div className="rounded-xl bg-surface-muted px-3 py-2">
              <dt className="text-ink-muted">SKU</dt>
              <dd className="font-semibold text-ink">{product.sku}</dd>
            </div>
          </dl>

          <p className="text-ink-muted leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-3">
            {inCart ? (
              <Button variant="secondary" onClick={() => removeItem(product.id)}>
                Remove from bag
              </Button>
            ) : (
              <Button disabled={isOutOfStock} onClick={() => addItem(product)}>
                Add to bag
              </Button>
            )}
            <Link to="/cart">
              <Button variant="ghost">View bag</Button>
            </Link>
          </div>

          {product.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
