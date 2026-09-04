import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ContentStatus } from '@/lib/supabase/types'

/**
 * Small shared pieces for admin screens.
 *
 * Server components — none of them hold state — so they can be composed
 * freely inside pages without pulling the whole subtree into the client
 * bundle.
 */

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-border pb-6">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{eyebrow}</p>
        <h1 className="mt-2 text-h3">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}

/**
 * Status is carried by the word itself, not by colour alone — the label reads
 * "Draft" or "Published" whether or not the reader can distinguish the two
 * tints.
 */
export function StatusPill({ status }: { status: ContentStatus | 'visible' | 'hidden' }) {
  const isLive = status === 'published' || status === 'visible'
  const label =
    status === 'published'
      ? 'Published'
      : status === 'draft'
        ? 'Draft'
        : status === 'visible'
          ? 'Visible'
          : 'Hidden'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em]',
        isLive
          ? 'border-accent-green/40 text-accent-green'
          : 'border-border-strong text-text-tertiary'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isLive ? 'bg-accent-green' : 'bg-[var(--tertiary)]'
        )}
      />
      {label}
    </span>
  )
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-dashed border-border-strong px-6 py-16 text-center">
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-text-secondary">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

const linkStyles =
  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'

export function AdminPrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className={cn(linkStyles, 'bg-accent-green text-accent-foreground hover:brightness-110')}
      href={href}
    >
      {children}
    </Link>
  )
}

export function AdminSecondaryLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const className = cn(
    linkStyles,
    'border border-border-strong text-text-primary hover:border-accent-green hover:text-accent-green'
  )

  if (external) {
    return (
      <a className={className} href={href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  )
}

/** Row container for list views. Grid rather than <table>: the layout stacks on mobile. */
export function AdminList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-border border-y border-border">{children}</ul>
}

export function AdminListRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 py-5">{children}</li>
  )
}

export function MetaLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
      {children}
    </p>
  )
}

/** Absolute timestamps only. "3 days ago" hides whether a draft is stale. */
export function formatTimestamp(value: string | null): string {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
