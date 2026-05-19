import type { ProductId } from '@/entities/dummy-json/model/types'

export type CartLine = {
  id: ProductId
  title: string
  thumbnail: string
  price: number
  qty: number
}

export type CartState = Record<string, CartLine>

export type NoticeKind = 'success' | 'warning' | 'info'

export type Notice = {
  kind: NoticeKind
  message: string
} | null

export const CART_STORAGE_KEY = 'task6_inno_cart_v1'
