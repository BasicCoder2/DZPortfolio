'use server'

import { requireAdminForAction } from '@/lib/auth/admin'
import { experienceSchema } from '@/lib/content/schemas'
import { revalidateHomeSections } from '@/lib/content/cache'
import { errorState, successState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { toFormState } from '@/lib/actions/db-errors'
import { field, flag, id as parseId } from '@/lib/actions/form'

/**
 * Experience mutations.
 *
 * Experience entries render inline on the homepage and have no page of their
 * own, so create and update both stay on the list screen rather than
 * redirecting to an editor.
 */

export async function saveExperienceAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const parsed = experienceSchema.safeParse({
    organization: field(formData, 'organization'),
    role: field(formData, 'role'),
    location: field(formData, 'location'),
    startDate: field(formData, 'startDate'),
    endDate: field(formData, 'endDate'),
    isCurrent: flag(formData, 'isCurrent'),
    summary: field(formData, 'summary'),
    technologies: field(formData, 'technologies'),
    displayOrder: field(formData, 'displayOrder'),
    published: flag(formData, 'published'),
  })

  if (!parsed.success) {
    return errorState('Check the highlighted fields.', toFieldErrors(parsed.error))
  }

  const input = parsed.data
  const row = {
    organization: input.organization,
    role: input.role,
    location: input.location,
    start_date: input.startDate,
    end_date: input.endDate,
    is_current: input.isCurrent,
    summary: input.summary,
    technologies: input.technologies,
    display_order: input.displayOrder,
    published: input.published,
  }

  const recordId = parseId(formData)

  const { error } =
    recordId === null
      ? await auth.context.supabase.from('experience_entries').insert(row)
      : await auth.context.supabase.from('experience_entries').update(row).eq('id', recordId)

  if (error) return toFormState(error, 'experience')

  revalidateHomeSections()
  return successState(recordId === null ? 'Experience entry added.' : 'Experience entry saved.')
}

export async function setExperienceVisibilityAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That entry could not be found.')

  const published = flag(formData, 'published')

  const { error } = await auth.context.supabase
    .from('experience_entries')
    .update({ published })
    .eq('id', recordId)

  if (error) return toFormState(error, 'experience')

  revalidateHomeSections()
  return successState(published ? 'Entry is now visible.' : 'Entry hidden from the site.')
}

export async function deleteExperienceAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That entry could not be found.')

  const { error } = await auth.context.supabase
    .from('experience_entries')
    .delete()
    .eq('id', recordId)

  if (error) return toFormState(error, 'experience')

  revalidateHomeSections()
  return successState('Experience entry deleted.')
}
