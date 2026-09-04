'use server'

import { requireAdminForAction } from '@/lib/auth/admin'
import { certificationSchema } from '@/lib/content/schemas'
import { revalidateHomeSections } from '@/lib/content/cache'
import { errorState, successState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { toFormState } from '@/lib/actions/db-errors'
import { field, flag, id as parseId } from '@/lib/actions/form'
import { deleteStoredImage } from '@/lib/actions/media'

/** Certification mutations. Same authorization contract as the other actions. */

export async function saveCertificationAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const parsed = certificationSchema.safeParse({
    title: field(formData, 'title'),
    issuer: field(formData, 'issuer'),
    issueDate: field(formData, 'issueDate'),
    credentialUrl: field(formData, 'credentialUrl'),
    credentialId: field(formData, 'credentialId'),
    imagePath: field(formData, 'imagePath'),
    imageAlt: field(formData, 'imageAlt'),
    displayOrder: field(formData, 'displayOrder'),
    published: flag(formData, 'published'),
  })

  if (!parsed.success) {
    return errorState('Check the highlighted fields.', toFieldErrors(parsed.error))
  }

  const input = parsed.data
  const row = {
    title: input.title,
    issuer: input.issuer,
    issue_date: input.issueDate,
    credential_url: input.credentialUrl,
    credential_id: input.credentialId,
    image_path: input.imagePath,
    image_alt: input.imageAlt,
    display_order: input.displayOrder,
    published: input.published,
  }

  const recordId = parseId(formData)
  const previousImagePath = field(formData, 'previousImagePath')

  const { error } =
    recordId === null
      ? await auth.context.supabase.from('certifications').insert(row)
      : await auth.context.supabase.from('certifications').update(row).eq('id', recordId)

  if (error) return toFormState(error, 'certification')

  if (recordId !== null && previousImagePath && previousImagePath !== input.imagePath) {
    await deleteStoredImage(previousImagePath)
  }

  revalidateHomeSections()
  return successState(recordId === null ? 'Certification added.' : 'Certification saved.')
}

export async function setCertificationVisibilityAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That certification could not be found.')

  const published = flag(formData, 'published')

  const { error } = await auth.context.supabase
    .from('certifications')
    .update({ published })
    .eq('id', recordId)

  if (error) return toFormState(error, 'certification')

  revalidateHomeSections()
  return successState(published ? 'Certification is now visible.' : 'Certification hidden.')
}

export async function deleteCertificationAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That certification could not be found.')

  const { data, error } = await auth.context.supabase
    .from('certifications')
    .delete()
    .eq('id', recordId)
    .select('image_path')
    .single()

  if (error) return toFormState(error, 'certification')

  await deleteStoredImage(data.image_path)
  revalidateHomeSections()
  return successState('Certification deleted.')
}
