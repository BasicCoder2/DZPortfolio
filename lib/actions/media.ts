'use server'

import { requireAdminForAction } from '@/lib/auth/admin'
import { errorState, type FormState } from '@/lib/actions/state'
import {
  IMAGE_BUCKET,
  buildImagePath,
  isDeletableObjectPath,
  resolveImageUrl,
  validateImage,
} from '@/lib/media/images'

/**
 * Image upload and removal for content forms.
 *
 * The upload returns an object *path*, which the form stores in a hidden input
 * and submits with the rest of the record. Nothing is written to the database
 * here — the two steps stay separate so an abandoned form leaves an orphaned
 * object rather than a half-saved record, which is the cheaper mess.
 */

export interface UploadState extends FormState {
  /** Bucket-relative object path, to be saved on the record. */
  path?: string
  /** Resolved public URL, for the preview thumbnail. */
  url?: string
}

const FOLDERS = ['posts', 'projects', 'certifications'] as const
type Folder = (typeof FOLDERS)[number]

function isFolder(value: unknown): value is Folder {
  return typeof value === 'string' && (FOLDERS as readonly string[]).includes(value)
}

export async function uploadImageAction(
  _previous: UploadState,
  formData: FormData
): Promise<UploadState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const folder = formData.get('folder')
  if (!isFolder(folder)) {
    return errorState('Unknown upload destination.')
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return errorState('Choose an image to upload.')
  }

  // Read the head before the body: validation should reject a 40 MB file
  // without ever materialising 40 MB, and `slice` on a File does not.
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const validation = validateImage(file.type, file.size, header)
  if (!validation.ok) {
    return errorState(validation.message)
  }

  const path = buildImagePath(folder, validation.extension)

  const { error } = await auth.context.supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    contentType: validation.type,
    // Never overwrite. The path carries a UUID, so a collision would mean
    // something is badly wrong and silently replacing a file would hide it.
    upsert: false,
    cacheControl: '31536000',
  })

  if (error) {
    console.error(`[media] upload failed: ${error.message}`)
    return errorState('That image could not be uploaded. Try again.')
  }

  return {
    status: 'success',
    message: 'Image uploaded.',
    fieldErrors: {},
    path,
    url: resolveImageUrl(path) ?? undefined,
  }
}

/**
 * Removes an object from the bucket.
 *
 * Callers must have already cleared the reference from the database. Deleting
 * first would leave a row pointing at a missing file if the update then
 * failed, and a broken image is worse than an orphan.
 */
export async function deleteStoredImage(path: string | null | undefined): Promise<void> {
  if (!isDeletableObjectPath(path)) return

  const auth = await requireAdminForAction()
  if (!auth.ok) return

  const { error } = await auth.context.supabase.storage.from(IMAGE_BUCKET).remove([path])
  if (error) {
    // Non-fatal on purpose: the record already saved correctly, and a stranded
    // object costs storage, not correctness.
    console.error(`[media] failed to remove replaced image: ${error.message}`)
  }
}

/** Form-facing wrapper so a "Remove image" button can clear the field. */
export async function discardUploadAction(
  _previous: UploadState,
  formData: FormData
): Promise<UploadState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const path = formData.get('path')
  // Only unsaved uploads are deleted here. A path already attached to a record
  // is cleared by saving the record, which is what triggers the delete.
  if (formData.get('persisted') !== 'true' && typeof path === 'string') {
    await deleteStoredImage(path)
  }

  return { status: 'success', message: 'Image removed.', fieldErrors: {} }
}
