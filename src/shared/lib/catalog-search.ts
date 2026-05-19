import type { SortField, SortOrder } from '@/entities/dummy-json/model/types'

export const CATALOG_VIEW_ALL = 'all'
export const CATALOG_PAGE_SIZE = 20

export const CATALOG_SORT_OPTIONS = [
  { value: 'title-asc', label: 'Name A–Z' },
  { value: 'title-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price · low to high' },
  { value: 'price-desc', label: 'Price · high to low' },
  { value: 'rating-asc', label: 'Rating · low to high' },
  { value: 'rating-desc', label: 'Rating · high to low' },
  { value: 'stock-asc', label: 'Stock · low to high' },
  { value: 'stock-desc', label: 'Stock · high to low' },
] as const

export type CatalogSortKey = (typeof CATALOG_SORT_OPTIONS)[number]['value']

export type CatalogSearch = {
  page: number
  sort: CatalogSortKey
  category: string
  q: string
}

export const catalogSearchDefaults: CatalogSearch = {
  page: 1,
  sort: 'title-asc',
  category: CATALOG_VIEW_ALL,
  q: '',
}

const isSortKey = (value: string): value is CatalogSortKey =>
  CATALOG_SORT_OPTIONS.some((option) => option.value === value)

export function parseCatalogSearch(
  search: Record<string, unknown>,
): CatalogSearch {
  const pageRaw = search.page
  const page =
    typeof pageRaw === 'number'
      ? pageRaw
      : typeof pageRaw === 'string'
        ? Number.parseInt(pageRaw, 10)
        : 1

  const sortRaw = typeof search.sort === 'string' ? search.sort : ''
  const sort = isSortKey(sortRaw) ? sortRaw : catalogSearchDefaults.sort

  const categoryRaw = typeof search.category === 'string' ? search.category.trim() : ''
  const category = categoryRaw.length > 0 ? categoryRaw : CATALOG_VIEW_ALL

  const q = typeof search.q === 'string' ? search.q : ''

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    sort,
    category,
    q,
  }
}

export function parseSortKey(sortKey: CatalogSortKey): {
  sortBy: SortField
  order: SortOrder
} {
  const [sortBy, order] = sortKey.split('-') as [SortField, SortOrder]
  return { sortBy, order }
}

export function resolveCategory(
  category: string,
  availableCategories: string[],
): string {
  if (category === CATALOG_VIEW_ALL) return CATALOG_VIEW_ALL
  return availableCategories.includes(category) ? category : CATALOG_VIEW_ALL
}
