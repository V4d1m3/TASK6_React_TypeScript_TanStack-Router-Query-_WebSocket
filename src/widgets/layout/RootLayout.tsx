import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCart } from '@/features/cart/hooks/useCart'
import type { NoticeKind } from '@/features/cart/model/types'
import { catalogSearchDefaults } from '@/shared/lib/catalog-search'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Shop' },
  { to: '/cart', label: 'Bag' },
  { to: '/chat', label: 'Chat' },
] as const

const noticeStyles: Record<NoticeKind, string> = {
  success: 'bg-brand text-white',
  warning: 'bg-accent text-white',
  info: 'bg-ink text-white',
}

export function RootLayout() {
  const { session, isAuthenticated, signOut } = useAuth()
  const { itemCount, notice } = useCart()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-accent/90 py-1.5 text-center text-xs font-medium tracking-wide text-white">
        Free shipping on orders over $50 · All categories welcome
      </div>

      <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-brand">
            Bazaar
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const active =
                item.to === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  search={item.to === '/catalog' ? catalogSearchDefaults : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  {item.to === '/cart' && itemCount > 0 ? (
                    <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs text-white">
                      {itemCount}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && session ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-ink-muted sm:inline">
                  Hi, {session.user.firstName}
                </span>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink-muted hover:border-brand hover:text-brand"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-accent/90"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {notice ? (
          <div
            role="status"
            className={`mx-auto mb-3 max-w-6xl rounded-xl px-4 py-2 text-center text-sm font-medium sm:mx-6 ${noticeStyles[notice.kind]}`}
          >
            {notice.message}
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-line bg-surface-raised py-8 text-center text-sm text-ink-muted">
        <p className="font-display text-lg text-brand">Bazaar</p>
        <p className="mt-1">Universal marketplace demo · DummyJSON API</p>
      </footer>
    </div>
  )
}
