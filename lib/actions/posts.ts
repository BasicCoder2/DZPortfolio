'use server'

import { redirect } from 'next/navigation'
import { requireAdminForAction } from '@/lib/auth/admin'
import { postSchema } from '@/lib/content/schemas'
import { revalidatePosts } from '@/lib/content/cache'
import { errorState, successState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { toFormState } from '@/lib/actions/db-errors'
import { field, id as parseId } from '@/lib/actions/form'
import { deleteStoredImage } from '@/lib/actions/media'

/**
 * Blog post mutations.
 *
 * Every action re-authorizes. The admin layout already refused anonymous and
 * unauthorized callers before rendering the form, but a Server Action is a
 * public POST endpoint with a generated URL — it is reachable without ever
 * loading that layout, so the layout check is UI, and this is the control.
 */

/** Draft/published only; anything else is rejected before it reaches the DB. */
function readStatus(formData: FormData): 'draft' | 'published' {
  return formData.get('status') === 'published' ? 'published' : 'draft'
}

export async function savePostAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const parsed = postSchema.safeParse({
    title: field(formData, 'title'),
    slug: field(formData, 'slug'),
    excerpt: field(formData, 'excerpt'),
    content: field(formData, 'content'),
    coverImagePath: field(formData, 'coverImagePath'),
    coverImageAlt: field(formData, 'coverImageAlt'),
    status: readStatus(formData),
    seoTitle: field(formData, 'seoTitle'),
    seoDescription: field(formData, 'seoDescription'),
  })

  if (!parsed.success) {
    return errorState('Check the highlighted fields.', toFieldErrors(parsed.error))
  }

  const input = parsed.data
  const row = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt ?? '',
    content: input.content,
    cover_image_path: input.coverImagePath,
    cover_image_alt: input.coverImageAlt,
    status: input.status,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
  }

  const recordId = parseId(formData)
  const previousSlug = field(formData, 'previousSlug')
  const previousImagePath = field(formData, 'previousCoverImagePath')

  if (recordId === null) {
    const { data, error } = await auth.context.supabase
      .from('posts')
      .insert(row)
      .select('id, slug')
      .single()

    if (error) return toFormState(error, 'post')

    revalidatePosts(data.slug)
    redirect(`/admin/blog/${data.id}/edit?saved=1`)
  }

  const { data, error } = await auth.context.supabase
    .from('posts')
    .update(row)
    .eq('id', recordId)
    .select('id, slug')
    .single()

  if (error) return toFormState(error, 'post')

  // Only after the row is safely updated. Doing this first would strand a
  // published post pointing at an image that no longer exists.
  if (previousImagePath && previousImagePath !== input.coverImagePath) {
    await deleteStoredImage(previousImagePath)
  }

  revalidatePosts(data.slug)
  // A renamed post leaves a stale page at the old URL until that one is
  // rebuilt too.
  if (previousSlug && previousSlug !== data.slug) revalidatePosts(previousSlug)

  return successState(
    input.status === 'published' ? 'Saved and published.' : 'Draft saved.',
    data.id
  )
}

/** Publish / unpublish from a list row, without opening the editor. */
export async function setPostStatusAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That post could not be found.')

  const status = readStatus(formData)

  const { data, error } = await auth.context.supabase
    .from('posts')
    .update({ status })
    .eq('id', recordId)
    .select('slug')
    .single()

  if (error) return toFormState(error, 'post')

  revalidatePosts(data.slug)
  return successState(status === 'published' ? 'Post published.' : 'Post moved back to drafts.')
}

export async function deletePostAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That post could not be found.')

  const { data, error } = await auth.context.supabase
    .from('posts')
    .delete()
    .eq('id', recordId)
    .select('slug, cover_image_path')
    .single()

  if (error) return toFormState(error, 'post')

  await deleteStoredImage(data.cover_image_path)
  revalidatePosts(data.slug)

  redirect('/admin/blog?deleted=1')
}
