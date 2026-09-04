import Link from 'next/link'
import type { ContentStatus } from '@/lib/supabase/types'

/**
 * Header strip on draft preview screens.
 *
 * Says plainly that what follows is not live. Without it, a preview is
 * pixel-identical to the published page, and an operator can easily believe
 * they have already shipped something they have not.
 */
export function PreviewBanner({
  status,
  backHref,
  target,
}: {
  status: ContentStatus
  backHref: string
  target: string
}) {
  return (
    <div className="border-b border-border bg-surface px-6 py-3 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
          {status === 'draft' ? 'Draft preview — not visible to visitors' : 'Preview'}
        </p>
        <span className="font-mono text-xs text-text-tertiary">{target}</span>
        <Link
          className="ml-auto text-sm text-text-secondary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          href={backHref}
        >
          Back to the editor
        </Link>
      </div>
    </div>
  )
}
