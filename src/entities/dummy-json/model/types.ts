/** Domain types for DummyJSON will be expanded during feature implementation. */

export type ProductId = number

export type ProductListItem = {
  id: ProductId
  title: string
  thumbnail: string
  price: number
}

export type ProductListResponse = {
  products: ProductListItem[]
  total: number
  skip: number
  limit: number
}
