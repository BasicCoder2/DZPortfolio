'use client'

import { useActionState, useEffect, useState } from 'react'
import { saveExperienceAction } from '@/lib/actions/experience'
import { firstError, idleFormState } from '@/lib/actions/state'
import type { ExperienceEntry } from '@/lib/content/models'
import {
  CheckboxField,
  FormFeedback,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/admin/form-controls'

/**
 * Create / edit form for one experience entry.
 *
 * "Current role" disables and clears the end date rather than leaving both
 * enabled. The database rejects the combination outright
 * (`experience_current_has_no_end`), so the form should never let an operator
 * construct it in the first place.
 */
export function ExperienceForm({
  entry,
  onSaved,
}: {
  entry: ExperienceEntry | null
  onSaved?: () => void
}) {
  const [state, formAction] = useActionState(saveExperienceAction, idleFormState)
  const [isCurrent, setIsCurrent] = useState(entry?.isCurrent ?? false)
  const errors = state.fieldErrors

  // In an effect, not in the render body: calling a parent's setState during
  // render is what turns "close the panel after saving" into a render loop.
  useEffect(() => {
    if (state.status === 'success') onSaved?.()
  }, [state.status, onSaved])

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {entry && <input name="id" type="hidden" value={entry.id} />}

      <FormFeedback state={state} />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          required
          defaultValue={entry?.organization ?? ''}
          error={firstError(errors, 'organization')}
          label="Organization"
          name="organization"
          placeholder="Levy Mwanawasa Medical University"
        />
        <TextField
          required
          defaultValue={entry?.role ?? ''}
          error={firstError(errors, 'role')}
          label="Role"
          name="role"
          placeholder="Software Developer"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TextField
          defaultValue={entry?.location ?? ''}
          error={firstError(errors, 'location')}
          label="Location"
          name="location"
          placeholder="Lusaka, Zambia"
        />
        <TextField
          defaultValue={entry?.startDate ?? ''}
          error={firstError(errors, 'startDate')}
          hint="Optional. Leave blank and no period is shown."
          label="Start date"
          name="startDate"
          type="date"
        />
        {/* Disabled inputs are not submitted, so the server sees no end date
            at all for a current role — which is exactly what the DB constraint
            requires. */}
        <TextField
          defaultValue={entry?.endDate ?? ''}
          disabled={isCurrent}
          error={firstError(errors, 'endDate')}
          hint={isCurrent ? 'Not used while this is your current role.' : undefined}
          label="End date"
          name="endDate"
          type="date"
        />
      </div>

      <CheckboxField
        checked={isCurrent}
        hint="Shows as “Present” on the public timeline."
        label="This is my current role"
        name="isCurrent"
        onChange={setIsCurrent}
      />

      <TextAreaField
        defaultValue={entry?.summary ?? ''}
        error={firstError(errors, 'summary')}
        hint="One or two sentences describing the work."
        label="Summary"
        name="summary"
        rows={3}
      />

      <TextAreaField
        defaultValue={entry?.technologies.join(', ') ?? ''}
        error={firstError(errors, 'technologies')}
        hint="Comma separated."
        label="Technologies"
        name="technologies"
        placeholder="Laravel, React, MySQL"
        rows={2}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={String(entry?.displayOrder ?? 0)}
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
            defaultChecked={entry?.published ?? false}
            hint="Unpublished entries stay here and never reach the site."
            label="Show on the public site"
            name="published"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <SubmitButton>{entry ? 'Save entry' : 'Add entry'}</SubmitButton>
      </div>
    </form>
  )
}
