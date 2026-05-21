import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react'
import { useChat } from '@/features/chat/hooks/useChat'
import type { ChatMessage } from '@/features/chat/model/types'
import { Button } from '@/shared/ui/Button'

const statusLabel: Record<string, string> = {
  idle: 'Idle',
  connecting: 'Connecting…',
  open: 'Connected',
  closed: 'Disconnected',
  error: 'Error',
}

const statusTone: Record<string, string> = {
  idle: 'bg-surface-muted text-ink-muted',
  connecting: 'bg-accent/15 text-accent',
  open: 'bg-brand/15 text-brand',
  closed: 'bg-surface-muted text-ink-muted',
  error: 'bg-danger/10 text-danger',
}

export function ChatPanel() {
  const {
    wsUrl,
    status,
    messages,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    isConnected,
  } = useChat()

  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight
    })
  }, [messages])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(draft)
    setDraft('')
  }

  const canSend = draft.trim().length > 0

  return (
    <div className="flex flex-col gap-4">
      <ChatToolbar
        wsUrl={wsUrl}
        statusLabel={statusLabel[status] ?? status}
        statusTone={statusTone[status] ?? statusTone.idle}
        isConnected={isConnected}
        onConnect={connect}
        onDisconnect={disconnect}
        onClear={clearMessages}
      />

      <p className="text-sm text-ink-muted">
        Public echo server: whatever you send is returned as a WebSocket message. A
        first line like &quot;Request served by …&quot; is a normal server greeting.
        Message history is kept when you leave this page.
      </p>

      <ChatMessageList messages={messages} listRef={listRef} />

      <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message…"
          disabled={status === 'closed'}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-ink disabled:opacity-60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <Button type="submit" disabled={!canSend}>
          Send
        </Button>
      </form>
    </div>
  )
}

type ChatToolbarProps = {
  wsUrl: string
  statusLabel: string
  statusTone: string
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
  onClear: () => void
}

function ChatToolbar({
  wsUrl,
  statusLabel,
  statusTone,
  isConnected,
  onConnect,
  onDisconnect,
  onClear,
}: ChatToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}
        >
          {statusLabel}
        </span>
        <code className="text-xs text-ink-muted">{wsUrl}</code>
      </div>
      <div className="flex flex-wrap gap-2">
        {!isConnected ? (
          <Button type="button" variant="secondary" onClick={onConnect}>
            Connect
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={onDisconnect}>
            Disconnect
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}

type ChatMessageListProps = {
  messages: ChatMessage[]
  listRef: RefObject<HTMLDivElement | null>
}

function ChatMessageList({ messages, listRef }: ChatMessageListProps) {
  return (
    <div
      ref={listRef}
      className="flex h-80 flex-col gap-2 overflow-y-auto rounded-2xl border border-line bg-canvas p-4 sm:h-96"
      role="log"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <p className="text-sm text-ink-subtle">No messages yet.</p>
      ) : (
        messages.map((message) => <ChatBubble key={message.id} message={message} />)
      )}
    </div>
  )
}

type ChatBubbleProps = {
  message: ChatMessage
}

function ChatBubble({ message }: ChatBubbleProps) {
  if (message.direction === 'system') {
    return (
      <p className="text-center text-xs text-ink-subtle">{message.text}</p>
    )
  }

  const isSent = message.direction === 'sent'

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
          isSent
            ? 'bg-brand text-white'
            : 'border border-line bg-surface-raised text-ink'
        }`}
      >
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">
          {isSent ? 'You' : 'Echo'}
        </p>
        <p className="break-words">{message.text}</p>
      </div>
    </div>
  )
}
