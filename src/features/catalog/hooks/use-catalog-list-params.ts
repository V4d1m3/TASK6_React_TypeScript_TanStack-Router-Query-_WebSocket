import { useMemo } from 'react'
import { categorySlugs } from '@/entities/dummy-json/api/normalize-categories'
import { useProductCategoriesQuery } from '@/entities/dummy-json/api/hooks'
import { mapSearchToProductListParams } from '@/features/catalog/lib/map-search-to-product-list-params'
import {
  CATALOG_PAGE_SIZE,
  resolveCategory,
  type CatalogSearch,
} from '@/shared/lib/catalog-search'

export function useCatalogListParams(search: CatalogSearch) {
  const categoriesQuery = useProductCategoriesQuery()
  const categoryList = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  )
  const categorySlugsList = useMemo(() => categorySlugs(categoryList), [categoryList])

  const category = useMemo(
    () => resolveCategory(search.category, categorySlugsList),
    [search.category, categorySlugsList],
  )

  const listParams = useMemo(
    () => mapSearchToProductListParams(search, categorySlugsList, CATALOG_PAGE_SIZE),
    [search, categorySlugsList],
  )

  return {
    categoryList,
    category,
    listParams,
    pageSize: CATALOG_PAGE_SIZE,
  }
}
