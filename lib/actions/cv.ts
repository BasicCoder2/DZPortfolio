'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminForAction } from '@/lib/auth/admin'
import { errorState, successState, type FormState } from '@/lib/actions/state'
import { CV_BUCKET, validateCv } from '@/lib/media/cv'

export async function updateCvAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)
  const file = formData.get('file')
  if (!(file instanceof File)) return errorState('Choose a PDF to upload.')
  const validation = validateCv(file.size, new Uint8Array(await file.slice(0, 5).arrayBuffer()))
  if (validation) return errorState(validation)

  const { supabase } = auth.context
  const path = `${crypto.randomUUID()}.pdf`
  const bucket = supabase.storage.from(CV_BUCKET)
  const { error: uploadError } = await bucket.upload(path, file, {
    contentType: 'application/pdf',
    cacheControl: '31536000',
    upsert: false,
  })
  if (uploadError)
    return errorState(
      'CV upload failed. Check that the CV storage migration has been applied, then try again.'
    )

  const { error } = await supabase.from('site_cv').upsert({
    id: 'current',
    path,
    filename: file.name,
    updated_at: new Date().toISOString(),
  })
  if (error) {
    await bucket.remove([path])
    return errorState(
      'The CV could not be saved. Your previous download is unchanged. Check the CV database setup and try again.'
    )
  }
  revalidatePath('/admin/cv')
  return successState('CV updated. All download buttons now serve this PDF.')
}
