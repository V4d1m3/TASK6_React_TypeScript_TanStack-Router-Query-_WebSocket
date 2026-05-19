export type ProductId = number

export type ProductCategory = {
  slug: string
  name: string
  url: string
}

export type SortField = 'title' | 'price' | 'rating' | 'stock'
export type SortOrder = 'asc' | 'desc'

export type Product = {
  id: ProductId
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  images: string[]
  thumbnail: string
}

export type ProductReview = {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export type ProductListItem = Pick<
  Product,
  | 'id'
  | 'title'
  | 'thumbnail'
  | 'price'
  | 'rating'
  | 'brand'
  | 'category'
  | 'availabilityStatus'
>

export type ProductListResponse = {
  products: ProductListItem[]
  total: number
  skip: number
  limit: number
}

export type ProductListParams = {
  limit: number
  skip: number
  sortBy: SortField
  order: SortOrder
  category: string
  q: string
}

export type LoginPayload = {
  username: string
  password: string
  expiresInMins?: number
}

export type AuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export type LoginResponse = AuthUser & {
  accessToken: string
  refreshToken: string
  token?: string
}

export type AuthSession = {
  token: string
  refreshToken: string
  user: AuthUser
}
