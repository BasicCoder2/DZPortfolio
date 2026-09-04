'use client'

import { useActionState, useEffect, useState } from 'react'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { SubmitButton } from '@/components/admin/form-controls'
import { idleFormState, type FormState } from '@/lib/actions/state'

/**
 * Per-row actions in the admin list views.
 *
 * Both take the Server Action as a prop rather than importing it, so one pair
 * of components serves posts, projects, experience, certifications and
 * engagement without a registry mapping strings to functions.
 */

export type RowAction = (state: FormState, formData: FormData) => Promise<FormState>

/**
 * Publish / unpublish straight from a list row.
 *
 * The button says what will happen ("Publish"), not what is currently true —
 * a control labelled with its own state is the classic toggle ambiguity.
 */
export function StatusToggleForm({
  action,
  id,
  isLive,
  field,
  liveValue,
  draftValue,
  publishLabel,
  unpublishLabel,
  onResult,
}: {
  action: RowAction
  id: string
  isLive: boolean
  /** Form field the server reads: 'status' for posts/projects, 'published' otherwise. */
  field: 'status' | 'published'
  liveValue: string
  draftValue: string
  publishLabel: string
  unpublishLabel: string
  onResult?: (state: FormState) => void
}) {
  const [state, formAction] = useActionState(action, idleFormState)

  useEffect(() => {
    if (state.status !== 'idle') onResult?.(state)
  }, [state, onResult])

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={id} />
      <input name={field} type="hidden" value={isLive ? draftValue : liveValue} />
      <SubmitButton pendingLabel="Working…" variant="secondary">
        {isLive ? unpublishLabel : publishLabel}
      </SubmitButton>
    </form>
  )
}

/**
 * Delete, behind a confirmation dialog.
 *
 * The dialog names the record. "Delete this item?" is a question nobody can
 * answer safely; "Delete 'Building useful systems'?" is.
 */
export function ConfirmDeleteForm({
  action,
  id,
  recordName,
  description,
  label = 'Delete',
  onResult,
}: {
  action: RowAction
  id: string
  recordName: string
  description?: string
  label?: string
  onResult?: (state: FormState) => void
}) {
  const [state, formAction] = useActionState(action, idleFormState)
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (state.status !== 'idle') {
      setSubmitting(false)
      onResult?.(state)
    }
  }, [state, onResult])

  return (
    <>
      <button
        className="rounded-md border border-[var(--danger)]/40 px-3 py-2 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
        type="button"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      <AlertDialog
        actionLabel={submitting ? 'Deleting…' : 'Delete permanently'}
        actionVariant="destructive"
        description={
          description ??
          'This cannot be undone. Any image attached to this record is removed from storage too.'
        }
        open={open}
        title={`Delete "${recordName}"?`}
        onAction={() => {
          setSubmitting(true)
          const formData = new FormData()
          formData.set('id', id)
          formAction(formData)
          setOpen(false)
        }}
        onOpenChange={setOpen}
      />
    </>
  )
}

/**
 * Shared live region for list-row outcomes.
 *
 * Rows post independently, so without one region per list an operator using a
 * screen reader would hear nothing after publishing from a row.
 */
export function RowFeedback({ state }: { state: FormState | null }) {
  if (!state || state.status === 'idle') {
    return <div aria-atomic="true" aria-live="polite" className="sr-only" />
  }

  return (
    <div aria-atomic="true" aria-live="polite">
      <p
        className={
          state.status === 'error' ? 'text-sm text-[var(--danger)]' : 'text-sm text-accent-green'
        }
        role={state.status === 'error' ? 'alert' : 'status'}
      >
        {state.message}
      </p>
    </div>
  )
}
