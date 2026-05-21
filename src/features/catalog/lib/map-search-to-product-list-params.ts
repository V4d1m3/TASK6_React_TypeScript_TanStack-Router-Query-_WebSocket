import type { ProductListParams } from '@/entities/dummy-json/model/types'
import {
  parseSortKey,
  resolveCategory,
  type CatalogSearch,
} from '@/shared/lib/catalog-search'

export function mapSearchToProductListParams(
  search: CatalogSearch,
  availableCategorySlugs: string[],
  pageSize: number,
): ProductListParams {
  const { sortBy, order } = parseSortKey(search.sort)
  const category = resolveCategory(search.category, availableCategorySlugs)

  return {
    limit: pageSize,
    skip: (search.page - 1) * pageSize,
    sortBy,
    order,
    category,
    q: search.q,
  }
}
