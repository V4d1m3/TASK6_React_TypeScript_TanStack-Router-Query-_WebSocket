import { createContext } from 'react'
import type {
  ChatConnectionStatus,
  ChatMessage,
} from '@/features/chat/model/types'

export type ChatContextValue = {
  wsUrl: string
  status: ChatConnectionStatus
  messages: ChatMessage[]
  isConnected: boolean
  isPageActive: boolean
  setPageActive: (active: boolean) => void
  connect: () => void
  disconnect: () => void
  sendMessage: (text: string) => void
  clearMessages: () => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)
