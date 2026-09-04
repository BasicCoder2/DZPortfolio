'use client'

import { useActionState, useEffect } from 'react'
import { saveCertificationAction } from '@/lib/actions/certifications'
import { firstError, idleFormState } from '@/lib/actions/state'
import type { Certification } from '@/lib/content/models'
import {
  CheckboxField,
  FormFeedback,
  SubmitButton,
  TextField,
} from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/ImageField'

/** Create / edit form for one certification. */
export function CertificationForm({
  certification,
  onSaved,
}: {
  certification: Certification | null
  onSaved?: () => void
}) {
  const [state, formAction] = useActionState(saveCertificationAction, idleFormState)
  const errors = state.fieldErrors

  useEffect(() => {
    if (state.status === 'success') onSaved?.()
  }, [state.status, onSaved])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {certification && <input name="id" type="hidden" value={certification.id} />}

      <FormFeedback state={state} />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          required
          defaultValue={certification?.title ?? ''}
          error={firstError(errors, 'title')}
          label="Title"
          name="title"
          placeholder="Huawei Cloud Computing"
        />
        <TextField
          required
          defaultValue={certification?.issuer ?? ''}
          error={firstError(errors, 'issuer')}
          label="Issuer"
          name="issuer"
          placeholder="Huawei"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={certification?.issueDate ?? ''}
          error={firstError(errors, 'issueDate')}
          hint="Optional. Shown as month and year."
          label="Issue date"
          name="issueDate"
          type="date"
        />
        <TextField
          defaultValue={certification?.credentialId ?? ''}
          error={firstError(errors, 'credentialId')}
          hint="Optional reference number from the issuer."
          label="Credential ID"
          name="credentialId"
        />
      </div>

      <TextField
        defaultValue={certification?.credentialUrl ?? ''}
        error={firstError(errors, 'credentialUrl')}
        hint="Optional. Full URL including https:// — links the certification for verification."
        label="Credential URL"
        name="credentialUrl"
        type="url"
      />

      <ImageField
        altError={firstError(errors, 'imageAlt')}
        altName="imageAlt"
        defaultAlt={certification?.imageAlt ?? null}
        defaultPath={certification?.imagePath ?? null}
        defaultUrl={certification?.imageUrl ?? null}
        folder="certifications"
        hint="Optional badge or certificate image."
        label="Badge image"
        pathName="imagePath"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={String(certification?.displayOrder ?? 0)}
          error={firstError(errors, 'displayOrder')}
          hint="Lower numbers appear first."
          inputMode="numeric"
          label="Display order"
          min="0"
          name="displayOrder"
          type="number"
        />
        <div className="flex items-end pb-2">
          <CheckboxField
            defaultChecked={certification?.published ?? false}
            hint="Unpublished certifications never reach the site."
            label="Show on the public site"
            name="published"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <SubmitButton>{certification ? 'Save certification' : 'Add certification'}</SubmitButton>
      </div>
    </form>
  )
}
