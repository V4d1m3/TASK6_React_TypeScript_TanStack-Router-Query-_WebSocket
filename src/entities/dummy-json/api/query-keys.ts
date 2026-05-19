import type { ProductListParams } from '@/entities/dummy-json/model/types'

export const dummyJsonKeys = {
  all: ['dummy-json'] as const,
  categories: () => [...dummyJsonKeys.all, 'categories'] as const,
  products: (params: ProductListParams) =>
    [...dummyJsonKeys.all, 'products', params] as const,
  product: (id: number) => [...dummyJsonKeys.all, 'product', id] as const,
}
