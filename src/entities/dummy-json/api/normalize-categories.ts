import type { ProductCategory } from '@/entities/dummy-json/model/types'

type CategoriesResponse =
  | ProductCategory[]
  | string[]
  | { value?: ProductCategory[] }

export function normalizeCategories(response: CategoriesResponse): ProductCategory[] {
  if (Array.isArray(response)) {
    if (response.length === 0) return []

    if (typeof response[0] === 'string') {
      return (response as string[]).map((slug) => ({
        slug,
        name: slug,
        url: `https://dummyjson.com/products/category/${slug}`,
      }))
    }

    return response as ProductCategory[]
  }

  if (response && Array.isArray(response.value)) {
    return response.value
  }

  return []
}

export function categorySlugs(categories: ProductCategory[]): string[] {
  return categories.map((category) => category.slug)
}
