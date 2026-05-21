import { useContext } from 'react'
import { ChatContext } from '@/features/chat/context/chat-context'

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
