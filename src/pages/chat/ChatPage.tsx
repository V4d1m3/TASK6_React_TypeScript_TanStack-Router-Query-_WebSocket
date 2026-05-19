import { env } from '@/shared/config/env'

export function ChatPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Chat</h1>
      <p className="mt-2 text-ink-muted">WebSocket module (extra) — coming soon.</p>
      <p className="mt-6 rounded-2xl border border-dashed border-line bg-surface-raised px-4 py-3 text-sm text-ink-muted">
        Planned endpoint:{' '}
        <code className="font-mono text-brand">{env.wsUrl}</code>
      </p>
    </div>
  )
}
