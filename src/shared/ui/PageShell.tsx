import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  )
}
