'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ConfirmDeleteForm,
  RowFeedback,
  StatusToggleForm,
  type RowAction,
} from '@/components/admin/RowActions'
import type { FormState } from '@/lib/actions/state'

/**
 * Publish toggle + delete for one list row, sharing a single live region.
 *
 * Each row owns its feedback rather than the list owning one for all of them:
 * a message that appears next to the row you just acted on needs no wording to
 * explain which row it refers to.
 *
 * `setFeedback` is passed as the callback directly — React guarantees setState
 * identity is stable, which is what keeps the child effects from re-firing on
 * every render.
 */
export function ContentRowActions({
  id,
  name,
  isLive,
  field,
  liveValue,
  draftValue,
  publishLabel,
  unpublishLabel,
  statusAction,
  deleteAction,
  deleteDescription,
  editHref,
  onEdit,
  editExpanded,
}: {
  id: string
  name: string
  isLive: boolean
  field: 'status' | 'published'
  liveValue: string
  draftValue: string
  publishLabel: string
  unpublishLabel: string
  statusAction: RowAction
  deleteAction: RowAction
  deleteDescription?: string
  editHref?: string
  onEdit?: () => void
  editExpanded?: boolean
}) {
  const [feedback, setFeedback] = useState<FormState | null>(null)

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {editHref ? (
          <Link
            aria-label={`Edit ${name}`}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            href={editHref}
          >
            Edit
          </Link>
        ) : onEdit ? (
          <button
            aria-expanded={editExpanded}
            aria-label={`Edit ${name}`}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            type="button"
            onClick={onEdit}
          >
            Edit
          </button>
        ) : null}
        <StatusToggleForm
          action={statusAction}
          draftValue={draftValue}
          field={field}
          id={id}
          isLive={isLive}
          liveValue={liveValue}
          publishLabel={publishLabel}
          unpublishLabel={unpublishLabel}
          onResult={setFeedback}
        />
        <ConfirmDeleteForm
          action={deleteAction}
          description={deleteDescription}
          id={id}
          recordName={name}
          onResult={setFeedback}
        />
      </div>
      <RowFeedback state={feedback} />
    </div>
  )
}
