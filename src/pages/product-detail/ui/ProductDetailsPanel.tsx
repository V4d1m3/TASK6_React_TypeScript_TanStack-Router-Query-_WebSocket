import { Link } from '@tanstack/react-router'
import type { Product } from '@/entities/dummy-json/model/types'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatPrice } from '@/shared/lib/format'
import { Button } from '@/shared/ui/Button'

type ProductDetailsPanelProps = {
  product: Product
}

export function ProductDetailsPanel({ product }: ProductDetailsPanelProps) {
  const { addItem, removeItem, isInCart } = useCart()
  const inCart = isInCart(product.id)
  const isOutOfStock = product.availabilityStatus === 'Out of Stock'

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-accent">
          {product.brand}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink">
          {product.title}
        </h1>
        <p className="mt-3 text-3xl font-bold text-brand">
          {formatPrice(product.price)}
        </p>
        {product.discountPercentage > 0 ? (
          <p className="text-sm text-accent">{product.discountPercentage}% off</p>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <SpecItem label="Rating" value={`★ ${product.rating}`} />
        <SpecItem label="Stock" value={String(product.stock)} />
        <SpecItem label="Status" value={product.availabilityStatus} />
        <SpecItem label="SKU" value={product.sku} />
      </dl>

      <p className="leading-relaxed text-ink-muted">{product.description}</p>

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
  )
}

type SpecItemProps = {
  label: string
  value: string
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div className="rounded-xl bg-surface-muted px-3 py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  )
}
