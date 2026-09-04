import Link from 'next/link'

/** Record-not-found inside the admin shell. Keeps the operator in context. */
export default function AdminNotFound() {
  return (
    <div className="rounded-md border border-dashed border-border-strong px-6 py-16 text-center">
      <p className="text-lg font-semibold text-text-primary">That record no longer exists</p>
      <p className="mx-auto mt-2 max-w-md text-text-secondary">
        It may have been deleted, or the link may be out of date.
      </p>
      <Link
        className="mt-6 inline-block rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent-green hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
        href="/admin"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
