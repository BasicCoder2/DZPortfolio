'use client'

import { useActionState, useState } from 'react'
import { updateCvAction } from '@/lib/actions/cv'
import { idleFormState } from '@/lib/actions/state'
import { MAX_CV_BYTES } from '@/lib/media/cv'
import { SubmitButton } from '@/components/admin/form-controls'
import { RowFeedback } from '@/components/admin/RowActions'

export function CvForm() {
  const [state, action, pending] = useActionState(updateCvAction, idleFormState)
  const [fileError, setFileError] = useState('')
  return (
    <form
      action={action}
      className="space-y-5"
      onSubmit={(event) => {
        if (fileError || pending) event.preventDefault()
      }}
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="cv-file">
          CV PDF
        </label>
        <input
          required
          accept="application/pdf,.pdf"
          aria-describedby="cv-hint cv-error"
          className="block w-full rounded-md border border-border p-3"
          disabled={pending}
          id="cv-file"
          name="file"
          type="file"
          onChange={(event) =>
            setFileError(
              (event.target.files?.[0]?.size ?? 0) > MAX_CV_BYTES
                ? 'The CV must be 3 MB or smaller.'
                : ''
            )
          }
        />
        <p className="text-sm text-text-secondary" id="cv-hint">
          PDF, up to 3 MB. Uploading replaces the CV linked from every download button. This
          document will be public.
        </p>
        <p className="text-sm text-[var(--danger)]" id="cv-error" role="alert">
          {fileError}
        </p>
      </div>
      <SubmitButton pendingLabel="Uploading CV?">Update CV</SubmitButton>
      <RowFeedback state={state} />
    </form>
  )
}
