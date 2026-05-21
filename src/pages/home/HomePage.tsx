import { Link } from '@tanstack/react-router'
import {
  useProductCategoriesQuery,
  useProductListQuery,
} from '@/entities/dummy-json/api/hooks'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatCategoryLabel } from '@/shared/lib/format'
import {
  CATALOG_VIEW_ALL,
  catalogSearchDefaults,
  parseSortKey,
} from '@/shared/lib/catalog-search'
import { formatApiError } from '@/shared/lib/format-api-error'
import { Button } from '@/shared/ui/Button'
import { ProductCard } from '@/shared/ui/ProductCard'
import { CategoryGridSkeleton } from '@/shared/ui/CategoryGridSkeleton'
import { ProductGridSkeleton } from '@/shared/ui/ProductGridSkeleton'
import { StateMessage } from '@/shared/ui/StateMessage'

export function HomePage() {
  const { isAuthenticated } = useAuth()
  const categoriesQuery = useProductCategoriesQuery()
  const featuredSort = parseSortKey('rating-desc')
  const featuredQuery = useProductListQuery({
    limit: 4,
    skip: 0,
    sortBy: featuredSort.sortBy,
    order: featuredSort.order,
    category: CATALOG_VIEW_ALL,
    q: '',
  })

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-brand/15 via-surface to-accent/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20 lg:px-8">
          <div className="space-y-6">
            <p className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Everything store
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Discover products across every aisle
            </h1>
            <p className="max-w-lg text-lg text-ink-muted">
              Fashion, beauty, furniture, groceries, and more — powered by DummyJSON with no
              category restrictions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalog" search={catalogSearchDefaults}>
                <Button>Browse shop</Button>
              </Link>
              {!isAuthenticated ? (
                <Link to="/login">
                  <Button variant="secondary">Sign in</Button>
                </Link>
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Beauty', 'Groceries', 'Furniture', 'Sports'].map((label) => (
              <div
                key={label}
                className="rounded-2xl border border-line bg-surface-raised/80 p-4 text-center shadow-sm"
              >
                <p className="font-display text-lg text-brand">{label}</p>
                <p className="mt-1 text-xs text-ink-muted">Curated picks</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">Shop by category</h2>
            <p className="mt-1 text-sm text-ink-muted">All DummyJSON departments</p>
          </div>
          <Link
            to="/catalog"
            search={catalogSearchDefaults}
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <CategoryGridSkeleton />
        ) : categoriesQuery.isError ? (
          <StateMessage
            title="Could not load categories"
            message={formatApiError(
              categoriesQuery.error,
              'Failed to load category list.',
            )}
            tone="error"
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(categoriesQuery.data ?? []).map((category) => (
              <li key={category.slug}>
                <Link
                  to="/catalog"
                  search={{ category: category.slug, page: 1, sort: 'title-asc', q: '' }}
                  className="block rounded-2xl border border-line bg-surface-raised px-3 py-4 text-center text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                >
                  {formatCategoryLabel(category)}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-line bg-surface-raised/60 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-ink">Top rated this week</h2>
          {featuredQuery.isLoading ? (
            <ProductGridSkeleton count={4} className="mt-6 lg:grid-cols-4" />
          ) : featuredQuery.isError ? (
            <div className="mt-6">
              <StateMessage
                title="Could not load featured products"
                message={formatApiError(
                  featuredQuery.error,
                  'Failed to load featured picks.',
                )}
                tone="error"
              />
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(featuredQuery.data?.products ?? []).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  imageLoading={index < 2 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
