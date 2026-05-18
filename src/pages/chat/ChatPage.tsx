import { PageShell } from '@/shared/ui/PageShell'
import { env } from '@/shared/config/env'

export function ChatPage() {
  return (
    <PageShell title="Chat" description="WebSocket chat module (extra).">
      <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600">
        Planned endpoint: <code className="text-slate-800">{env.wsUrl}</code>
      </p>
    </PageShell>
  )
}
