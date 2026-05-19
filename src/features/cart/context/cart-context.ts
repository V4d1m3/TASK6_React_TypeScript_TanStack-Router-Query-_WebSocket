import { createContext } from 'react'
import type { CartState, Notice } from '@/features/cart/model/types'
import type { ProductListItem } from '@/entities/dummy-json/model/types'

type AddPayload = Pick<ProductListItem, 'id' | 'title' | 'thumbnail' | 'price'>

export type CartContextValue = {
  cart: CartState
  itemCount: number
  notice: Notice
  addItem: (product: AddPayload) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  clearNotice: () => void
  isInCart: (productId: number) => boolean
}

export const CartContext = createContext<CartContextValue | null>(null)
