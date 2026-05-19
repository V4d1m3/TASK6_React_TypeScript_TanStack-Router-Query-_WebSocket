import { Link } from '@tanstack/react-router'
import type { ProductListItem } from '@/entities/dummy-json/model/types'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatPrice } from '@/shared/lib/format'
import { Button } from '@/shared/ui/Button'

type ProductCardProps = {
  product: ProductListItem
  imageLoading?: 'lazy' | 'eager'
}

export function ProductCard({ product, imageLoading = 'lazy' }: ProductCardProps) {
  const { addItem } = useCart()
  const isOutOfStock = product.availabilityStatus === 'Out of Stock'

  const handleAdd = () => {
    if (isOutOfStock) return
    addItem(product)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface-raised shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to="/products/$productId"
        params={{ productId: String(product.id) }}
        className="relative block aspect-square overflow-hidden bg-surface-muted"
      >
        <img
          src={product.thumbnail}
          alt=""
          loading={imageLoading}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isOutOfStock
              ? 'bg-danger/90 text-white'
              : 'bg-surface-raised/95 text-ink-muted backdrop-blur'
          }`}
        >
          {product.availabilityStatus}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {product.brand}
          </p>
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-ink">
            <Link
              to="/products/$productId"
              params={{ productId: String(product.id) }}
              className="hover:text-brand"
            >
              {product.title}
            </Link>
          </h2>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-brand">{formatPrice(product.price)}</p>
            <p className="text-xs text-ink-muted">★ {product.rating}</p>
          </div>
          <Button
            variant="secondary"
            className="!rounded-2xl !px-3 !py-2 text-xs"
            disabled={isOutOfStock}
            onClick={handleAdd}
            aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.title} to bag`}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
