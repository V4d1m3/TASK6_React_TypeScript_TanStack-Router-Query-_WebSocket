import { Link } from '@tanstack/react-router'
import { useCart } from '@/features/cart/hooks/useCart'
import { formatPrice } from '@/shared/lib/format'
import { catalogSearchDefaults } from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'
import { StateMessage } from '@/shared/ui/StateMessage'

export function CartPage() {
  const { cart, removeItem, clearCart } = useCart()
  const lines = Object.values(cart)
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <StateMessage
          title="Your bag is empty"
          message="Explore the shop and add something you like."
        />
        <Link to="/catalog" search={catalogSearchDefaults} className="mt-6 inline-block">
          <Button>Go shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Your bag</h1>
          <p className="mt-1 text-ink-muted">{lines.length} product line(s)</p>
        </div>
        <Button variant="ghost" onClick={clearCart}>
          Clear bag
        </Button>
      </header>

      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex gap-4 rounded-2xl border border-line bg-surface-raised p-4 shadow-sm"
          >
            <img
              src={line.thumbnail}
              alt=""
              className="h-24 w-24 shrink-0 rounded-xl object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <Link
                  to="/products/$productId"
                  params={{ productId: String(line.id) }}
                  className="font-semibold text-ink hover:text-brand"
                >
                  {line.title}
                </Link>
                <p className="mt-1 text-sm text-ink-muted">
                  Qty {line.qty} · {formatPrice(line.price)} each
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-brand">
                  {formatPrice(line.price * line.qty)}
                </p>
                <Button
                  variant="secondary"
                  className="!px-3 !py-1.5 text-xs"
                  onClick={() => removeItem(line.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-8 rounded-2xl border border-line bg-brand/5 p-6">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span className="text-brand">{formatPrice(subtotal)}</span>
        </div>
        <Link to="/catalog" search={catalogSearchDefaults} className="mt-4 block">
          <Button variant="secondary" className="w-full">
            Continue shopping
          </Button>
        </Link>
      </footer>
    </div>
  )
}
