import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { parseCatalogSearch } from '@/shared/lib/catalog-search'
import { RouteFallback } from '@/shared/ui/RouteFallback'
import { RootLayout } from '@/widgets/layout/RootLayout'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(
    () => import('@/pages/home/HomePage'),
    'HomePage',
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(
    () => import('@/pages/login/LoginPage'),
    'LoginPage',
  ),
})

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  validateSearch: parseCatalogSearch,
  component: lazyRouteComponent(
    () => import('@/pages/catalog/CatalogPage'),
    'CatalogPage',
  ),
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: lazyRouteComponent(
    () => import('@/pages/cart/CartPage'),
    'CartPage',
  ),
})

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: lazyRouteComponent(
    () => import('@/pages/product-detail/ProductDetailPage'),
    'ProductDetailPage',
  ),
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: lazyRouteComponent(
    () => import('@/pages/chat/ChatPage'),
    'ChatPage',
  ),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  beforeLoad: () => {
    throw redirect({ to: '/' })
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  catalogRoute,
  cartRoute,
  productDetailRoute,
  chatRoute,
  notFoundRoute,
])

function routerBasepath(): string {
  const base = import.meta.env.BASE_URL
  if (base === '/') return '/'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export const router = createRouter({
  routeTree,
  basepath: routerBasepath(),
  defaultPendingComponent: RouteFallback,
  defaultPendingMs: 100,
  defaultPendingMinMs: 200,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
