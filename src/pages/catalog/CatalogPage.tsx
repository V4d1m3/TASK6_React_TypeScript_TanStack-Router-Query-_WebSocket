import { useEffect, useMemo, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { catalogRoute } from '@/app/router'
import {
  useProductCategoriesQuery,
  useProductListQuery,
} from '@/entities/dummy-json/api/hooks'
import { categorySlugs } from '@/entities/dummy-json/api/normalize-categories'
import { formatCategoryLabel } from '@/shared/lib/format'
import {
  CATALOG_PAGE_SIZE,
  CATALOG_SORT_OPTIONS,
  CATALOG_VIEW_ALL,
  catalogSearchDefaults,
  parseSortKey,
  resolveCategory,
  type CatalogSearch,
} from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'
import { ProductCard } from '@/shared/ui/ProductCard'
import { StateMessage } from '@/shared/ui/StateMessage'

export function CatalogPage() {
  const search = catalogRoute.useSearch()
  const navigate = useNavigate({ from: catalogRoute.fullPath })
  const { data: categories } = useProductCategoriesQuery()

  const categoryList = useMemo(() => categories ?? [], [categories])
  const categorySlugsList = useMemo(() => categorySlugs(categoryList), [categoryList])
  const category = useMemo(
    () => resolveCategory(search.category, categorySlugsList),
    [search.category, categorySlugsList],
  )

  const { sortBy, order } = parseSortKey(search.sort)
  const skip = (search.page - 1) * CATALOG_PAGE_SIZE

  const listQuery = useProductListQuery({
    limit: CATALOG_PAGE_SIZE,
    skip,
    sortBy,
    order,
    category,
    q: search.q,
  })

  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE))

  useEffect(() => {
    if (search.page > totalPages && total > 0) {
      void navigate({
        search: (prev: CatalogSearch) => ({ ...prev, page: totalPages }),
      })
    }
  }, [search.page, totalPages, total, navigate])

  const patchSearch = (patch: Partial<CatalogSearch>) => {
    void navigate({
      search: (prev: CatalogSearch) => ({
        ...prev,
        ...patch,
        page: patch.page ?? 1,
      }),
    })
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const q = String(formData.get('q') ?? '').trim()
    patchSearch({
      q,
      category: q.length > 0 ? CATALOG_VIEW_ALL : category,
    })
  }

  const rangeStart = total === 0 ? 0 : skip + 1
  const rangeEnd = Math.min(skip + CATALOG_PAGE_SIZE, total)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-bold text-ink">Shop</h1>
        <p className="text-ink-muted">
          Browse the full DummyJSON catalog — every category, no filters applied.
        </p>
      </header>

      <div className="mb-8 space-y-4 rounded-3xl border border-line bg-surface-raised p-5 shadow-sm">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={handleSearchSubmit}
        >
          <input
            key={search.q}
            type="search"
            name="q"
            defaultValue={search.q}
            placeholder="Search products…"
            className="min-w-0 flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink-muted">Category</span>
            <select
              value={category}
              onChange={(event) =>
                patchSearch({ category: event.target.value, q: '' })
              }
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink focus:border-brand focus:outline-none"
            >
              <option value={CATALOG_VIEW_ALL}>All categories</option>
              {categoryList.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {formatCategoryLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink-muted">Sort</span>
            <select
              value={search.sort}
              onChange={(event) =>
                patchSearch({
                  sort: event.target.value as CatalogSearch['sort'],
                })
              }
              className="w-full rounded-xl border border-line bg-canvas px-3 py-2.5 text-ink focus:border-brand focus:outline-none"
            >
              {CATALOG_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              className="w-full border border-line"
              onClick={() =>
                navigate({ search: catalogSearchDefaults, replace: true })
              }
            >
              Reset filters
            </Button>
          </div>
        </div>
      </div>

      {listQuery.isLoading ? (
        <StateMessage title="Loading products…" />
      ) : listQuery.isError ? (
        <StateMessage
          title="Could not load products"
          message={listQuery.error.message}
          tone="error"
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            Showing {rangeStart}–{rangeEnd} of {total}
            {search.q ? ` for “${search.q}”` : ''}
            {category !== CATALOG_VIEW_ALL
              ? ` in ${formatCategoryLabel(category)}`
              : ''}
          </p>

          {(listQuery.data?.products.length ?? 0) === 0 ? (
            <StateMessage
              title="No products found"
              message="Try another search or category."
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listQuery.data?.products.map((product, index) => (
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
                onClick={() => patchSearch({ page: search.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-ink-muted">
                Page {search.page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={search.page >= totalPages}
                onClick={() => patchSearch({ page: search.page + 1 })}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
