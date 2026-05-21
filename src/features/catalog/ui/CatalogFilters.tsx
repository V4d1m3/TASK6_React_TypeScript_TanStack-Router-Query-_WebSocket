import type { FormEvent } from 'react'
import type { ProductCategory } from '@/entities/dummy-json/model/types'
import { formatCategoryLabel } from '@/shared/lib/format'
import {
  CATALOG_SORT_OPTIONS,
  CATALOG_VIEW_ALL,
  type CatalogSearch,
} from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'

type CatalogFiltersProps = {
  search: CatalogSearch
  category: string
  categoryList: ProductCategory[]
  onPatchSearch: (patch: Partial<CatalogSearch>) => void
  onReset: () => void
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function CatalogFilters({
  search,
  category,
  categoryList,
  onPatchSearch,
  onReset,
  onSearchSubmit,
}: CatalogFiltersProps) {
  return (
    <div className="mb-8 space-y-4 rounded-3xl border border-line bg-surface-raised p-5 shadow-sm">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={onSearchSubmit}
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
              onPatchSearch({ category: event.target.value, q: '' })
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
              onPatchSearch({
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
            onClick={onReset}
          >
            Reset filters
          </Button>
        </div>
      </div>
    </div>
  )
}
