import { useEffect, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { catalogRoute } from '@/app/router'
import { useProductListQuery } from '@/entities/dummy-json/api/hooks'
import { useCatalogListParams } from '@/features/catalog/hooks/use-catalog-list-params'
import { CatalogFilters } from '@/features/catalog/ui/CatalogFilters'
import { CatalogProductGrid } from '@/features/catalog/ui/CatalogProductGrid'
import {
  CATALOG_VIEW_ALL,
  catalogSearchDefaults,
  type CatalogSearch,
} from '@/shared/lib/catalog-search'
import { formatApiError } from '@/shared/lib/format-api-error'

export function CatalogPage() {
  const search = catalogRoute.useSearch()
  const navigate = useNavigate({ from: catalogRoute.fullPath })
  const { categoryList, category, listParams, pageSize } =
    useCatalogListParams(search)

  const listQuery = useProductListQuery(listParams)

  const total = listQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const skip = listParams.skip

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
  const rangeEnd = Math.min(skip + pageSize, total)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-bold text-ink">Shop</h1>
        <p className="text-ink-muted">
          Browse the full DummyJSON catalog — every category, no filters applied.
        </p>
      </header>

      <CatalogFilters
        search={search}
        category={category}
        categoryList={categoryList}
        onPatchSearch={patchSearch}
        onReset={() =>
          navigate({ search: catalogSearchDefaults, replace: true })
        }
        onSearchSubmit={handleSearchSubmit}
      />

      <CatalogProductGrid
        search={search}
        category={category}
        products={listQuery.data?.products ?? []}
        total={total}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalPages={totalPages}
        isLoading={listQuery.isLoading}
        isError={listQuery.isError}
        errorMessage={formatApiError(
          listQuery.error,
          'Failed to load the product list.',
        )}
        onPageChange={(page) => patchSearch({ page })}
      />
    </div>
  )
}
