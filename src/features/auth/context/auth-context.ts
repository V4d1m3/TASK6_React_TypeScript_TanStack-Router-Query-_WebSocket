import { createContext } from 'react'
import type { AuthSession } from '@/features/auth/model/types'

export type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  signIn: (session: AuthSession) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
