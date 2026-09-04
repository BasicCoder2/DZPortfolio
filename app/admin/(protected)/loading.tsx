/**
 * Route-level loading state for admin screens.
 *
 * Every admin page is dynamic and hits the database, so there is always a gap
 * to fill. Skeleton bars rather than a spinner: they say roughly what is
 * coming, so the layout does not lurch when the data lands.
 */
export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="mb-10 border-b border-border pb-6">
        <div className="h-3 w-24 animate-pulse rounded bg-surface" />
        <div className="mt-4 h-7 w-56 animate-pulse rounded bg-surface" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((row) => (
          <div className="h-24 animate-pulse rounded-md bg-surface" key={row} />
        ))}
      </div>
    </div>
  )
}
