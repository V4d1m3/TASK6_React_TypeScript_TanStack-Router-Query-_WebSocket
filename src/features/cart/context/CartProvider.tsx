import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CartContext,
  type CartContextValue,
} from '@/features/cart/context/cart-context'
import type { CartState, Notice } from '@/features/cart/model/types'
import { CART_STORAGE_KEY } from '@/features/cart/model/types'
import type { ProductListItem } from '@/entities/dummy-json/model/types'
import { readStorage, writeStorage } from '@/shared/lib/storage'

type AddPayload = Pick<ProductListItem, 'id' | 'title' | 'thumbnail' | 'price'>

const persistCart = (cart: CartState) => {
  writeStorage(CART_STORAGE_KEY, cart)
}

const countItems = (cart: CartState): number =>
  Object.values(cart).reduce((sum, line) => sum + line.qty, 0)

type CartProviderProps = {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>(() =>
    readStorage<CartState>(CART_STORAGE_KEY, {}),
  )
  const [notice, setNotice] = useState<Notice>(null)

  const showNotice = useCallback((next: Notice) => {
    setNotice(next)
    if (next) {
      window.setTimeout(() => setNotice(null), 2800)
    }
  }, [])

  const addItem = useCallback(
    (product: AddPayload) => {
      setCart((prev) => {
        const key = String(product.id)
        const existing = prev[key]
        const next: CartState = {
          ...prev,
          [key]: existing
            ? { ...existing, qty: existing.qty + 1 }
            : {
                id: product.id,
                title: product.title,
                thumbnail: product.thumbnail,
                price: product.price,
                qty: 1,
              },
        }
        persistCart(next)
        return next
      })
      showNotice({ kind: 'success', message: `${product.title} added to bag.` })
    },
    [showNotice],
  )

  const removeItem = useCallback((productId: number) => {
    setCart((prev) => {
      const key = String(productId)
      const line = prev[key]
      if (!line) return prev

      const next = { ...prev }
      if (line.qty <= 1) {
        delete next[key]
      } else {
        next[key] = { ...line, qty: line.qty - 1 }
      }
      persistCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({})
    persistCart({})
    showNotice({ kind: 'info', message: 'Your bag is now empty.' })
  }, [showNotice])

  const isInCart = useCallback(
    (productId: number) => Boolean(cart[String(productId)]),
    [cart],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: countItems(cart),
      notice,
      addItem,
      removeItem,
      clearCart,
      clearNotice: () => setNotice(null),
      isInCart,
    }),
    [cart, notice, addItem, removeItem, clearCart, isInCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
