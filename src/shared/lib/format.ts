import type { ProductCategory } from '@/entities/dummy-json/model/types'

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
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }
  return 'Sign-in failed. Try another DummyJSON test account.'
}
