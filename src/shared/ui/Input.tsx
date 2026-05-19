import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const fieldId = id ?? props.name

  return (
    <label className="block space-y-1.5" htmlFor={fieldId}>
      <span className="text-sm font-medium text-ink-muted">{label}</span>
      <input
        id={fieldId}
        className={`w-full rounded-xl border border-line bg-surface-raised px-4 py-2.5 text-ink shadow-inner shadow-black/[0.02] transition placeholder:text-ink-subtle focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 ${className}`}
        {...props}
      />
    </label>
  )
}
