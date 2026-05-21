import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { queryClient } from '@/app/query-client'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { CartProvider } from '@/features/cart/context/CartProvider'
import { ChatProvider } from '@/features/chat/context/ChatProvider'

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ChatProvider>{children}</ChatProvider>
        </CartProvider>
      </AuthProvider>
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  )
}
