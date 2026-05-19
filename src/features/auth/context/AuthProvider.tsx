import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  AuthContext,
  type AuthContextValue,
} from '@/features/auth/context/auth-context'
import type { AuthSession } from '@/features/auth/model/types'
import { AUTH_STORAGE_KEY } from '@/features/auth/model/types'
import { readStorage, writeStorage } from '@/shared/lib/storage'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readStorage<AuthSession | null>(AUTH_STORAGE_KEY, null),
  )

  const signIn = useCallback((next: AuthSession) => {
    setSession(next)
    writeStorage(AUTH_STORAGE_KEY, next)
  }, [])

  const signOut = useCallback(() => {
    setSession(null)
    writeStorage(AUTH_STORAGE_KEY, null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
