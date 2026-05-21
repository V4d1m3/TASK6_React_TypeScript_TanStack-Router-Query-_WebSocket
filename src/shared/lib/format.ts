import type { ProductCategory } from '@/entities/dummy-json/model/types'
import { formatApiError } from '@/shared/lib/format-api-error'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCategoryLabel(category: string | ProductCategory): string {
  if (typeof category === 'object' && category !== null && 'name' in category) {
    return category.name
  }

  const slug = String(category)
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatLoginError(error: unknown): string {
  return formatApiError(error, 'Sign-in failed. Try another DummyJSON test account.')
}
