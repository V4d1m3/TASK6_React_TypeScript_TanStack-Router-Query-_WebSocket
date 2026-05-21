import { useEffect } from 'react'
import { ChatPanel } from '@/features/chat/ui/ChatPanel'
import { useChat } from '@/features/chat/hooks/useChat'

export function ChatPage() {
  const { setPageActive } = useChat()

  useEffect(() => {
    setPageActive(true)
    return () => setPageActive(false)
  }, [setPageActive])

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 space-y-2">
        <h1 className="font-display text-3xl font-bold text-ink">Chat</h1>
        <p className="text-ink-muted">
          Real-time WebSocket demo using an echo server (extra feature).
        </p>
      </header>
      <ChatPanel />
    </div>
  )
}
