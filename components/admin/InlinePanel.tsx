'use client'

/**
 * Shared chrome for the inline create/edit panels used by the experience,
 * certifications and engagement managers. Three copies of the same bordered
 * box with a cancel link is three chances for them to drift apart.
 */

export function InlinePanel({
  title,
  onCancel,
  children,
}: {
  title: string
  onCancel: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-md border border-border p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-text-primary">{title}</h2>
        <button
          className="text-sm text-text-tertiary underline-offset-4 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      {children}
    </div>
  )
}

export function AddRecordButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className="rounded-md bg-accent-green px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
}
