import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from '@tanstack/react-router'
import { useLoginMutation } from '@/entities/dummy-json/api/hooks'
import type { AuthSession } from '@/entities/dummy-json/model/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { formatLoginError } from '@/shared/lib/format'
import { catalogSearchDefaults } from '@/shared/lib/catalog-search'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

function toSession(response: {
  accessToken: string
  refreshToken: string
  token?: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}): AuthSession {
  return {
    token: response.accessToken || response.token || '',
    refreshToken: response.refreshToken,
    user: {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      image: response.image,
    },
  }
}

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const loginMutation = useLoginMutation()

  if (isAuthenticated) {
    return <Navigate to="/catalog" search={catalogSearchDefaults} />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    loginMutation.mutate(
      { username, password, expiresInMins: 60 },
      {
        onSuccess: (data) => {
          signIn(toSession(data))
          void navigate({ to: '/catalog', search: catalogSearchDefaults })
        },
      },
    )
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-line bg-surface-raised p-8 shadow-lg shadow-brand/5">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Account</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Demo login via DummyJSON <code className="text-brand">/auth/login</code>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {loginMutation.isError ? (
            <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              {formatLoginError(loginMutation.error)}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link
            to="/catalog"
            search={catalogSearchDefaults}
            className="font-semibold text-brand hover:underline"
          >
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  )
}
