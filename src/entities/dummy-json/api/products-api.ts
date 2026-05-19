import { httpClient } from '@/shared/api/http-client'
import { normalizeCategories } from '@/entities/dummy-json/api/normalize-categories'
import type {
  Product,
  ProductCategory,
  ProductListParams,
  ProductListResponse,
} from '@/entities/dummy-json/model/types'

type ListQuery = {
  limit: number
  skip: number
  sortBy: string
  order: string
}

const buildListQuery = ({ limit, skip, sortBy, order }: ListQuery): string => {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    sortBy,
    order,
  })
  return `?${params.toString()}`
}

export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const response = await httpClient<ProductCategory[] | string[]>('/products/categories')
  return normalizeCategories(response)
}

export async function fetchProductById(id: number): Promise<Product> {
  return httpClient<Product>(`/products/${id}`)
}

export async function fetchProductList(
  params: ProductListParams,
): Promise<ProductListResponse> {
  const query = buildListQuery(params)
  const q = params.q.trim()

  if (q.length > 0) {
    const searchParams = new URLSearchParams({
      q,
      limit: String(params.limit),
      skip: String(params.skip),
      sortBy: params.sortBy,
      order: params.order,
    })
    return httpClient<ProductListResponse>(`/products/search?${searchParams.toString()}`)
  }

  if (params.category !== 'all') {
    return httpClient<ProductListResponse>(
      `/products/category/${encodeURIComponent(params.category)}${query}`,
    )
  }

  return httpClient<ProductListResponse>(`/products${query}`)
}
