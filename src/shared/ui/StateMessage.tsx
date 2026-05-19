type StateMessageProps = {
  title: string
  message?: string
  tone?: 'neutral' | 'error'
}

export function StateMessage({
  title,
  message,
  tone = 'neutral',
}: StateMessageProps) {
  const toneClass =
    tone === 'error'
      ? 'border-danger/30 bg-danger/5 text-danger'
      : 'border-line bg-surface-raised text-ink-muted'

  return (
    <div className={`rounded-2xl border px-5 py-8 text-center ${toneClass}`}>
      <p className="text-base font-semibold text-ink">{title}</p>
      {message ? <p className="mt-2 text-sm">{message}</p> : null}
    </div>
  )
}
