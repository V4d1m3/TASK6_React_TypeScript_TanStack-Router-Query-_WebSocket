import { useMutation, useQuery } from '@tanstack/react-query'
import { loginRequest } from '@/entities/dummy-json/api/auth-api'
import { dummyJsonKeys } from '@/entities/dummy-json/api/query-keys'
import {
  fetchProductById,
  fetchProductCategories,
  fetchProductList,
} from '@/entities/dummy-json/api/products-api'
import type {
  LoginPayload,
  ProductListParams,
} from '@/entities/dummy-json/model/types'

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: dummyJsonKeys.categories(),
    queryFn: fetchProductCategories,
  })
}

export function useProductListQuery(params: ProductListParams) {
  return useQuery({
    queryKey: dummyJsonKeys.products(params),
    queryFn: () => fetchProductList(params),
    placeholderData: (previous) => previous,
  })
}

export function useProductQuery(productId: number) {
  return useQuery({
    queryKey: dummyJsonKeys.product(productId),
    queryFn: () => fetchProductById(productId),
    enabled: Number.isFinite(productId) && productId > 0,
  })
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
  })
}
