'use server'

import { redirect } from 'next/navigation'
import { requireAdminForAction } from '@/lib/auth/admin'
import { projectSchema } from '@/lib/content/schemas'
import { revalidateProjects } from '@/lib/content/cache'
import { errorState, successState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { toFormState } from '@/lib/actions/db-errors'
import { field, flag, id as parseId } from '@/lib/actions/form'
import { deleteStoredImage } from '@/lib/actions/media'

/** Project mutations. Same authorization contract as lib/actions/posts.ts. */

function readStatus(formData: FormData): 'draft' | 'published' {
  return formData.get('status') === 'published' ? 'published' : 'draft'
}

export async function saveProjectAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const parsed = projectSchema.safeParse({
    title: field(formData, 'title'),
    slug: field(formData, 'slug'),
    category: field(formData, 'category'),
    summary: field(formData, 'summary'),
    content: field(formData, 'content'),
    technologies: field(formData, 'technologies'),
    previewImagePath: field(formData, 'previewImagePath'),
    previewImageAlt: field(formData, 'previewImageAlt'),
    externalUrl: field(formData, 'externalUrl'),
    repositoryUrl: field(formData, 'repositoryUrl'),
    featured: flag(formData, 'featured'),
    displayOrder: field(formData, 'displayOrder'),
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
    category: input.category,
    summary: input.summary,
    content: input.content,
    technologies: input.technologies,
    preview_image_path: input.previewImagePath,
    preview_image_alt: input.previewImageAlt,
    external_url: input.externalUrl,
    repository_url: input.repositoryUrl,
    featured: input.featured,
    display_order: input.displayOrder,
    status: input.status,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
  }

  const recordId = parseId(formData)
  const previousSlug = field(formData, 'previousSlug')
  const previousImagePath = field(formData, 'previousPreviewImagePath')

  if (recordId === null) {
    const { data, error } = await auth.context.supabase
      .from('projects')
      .insert(row)
      .select('id, slug')
      .single()

    if (error) return toFormState(error, 'project')

    revalidateProjects(data.slug)
    redirect(`/admin/projects/${data.id}/edit?saved=1`)
  }

  const { data, error } = await auth.context.supabase
    .from('projects')
    .update(row)
    .eq('id', recordId)
    .select('id, slug')
    .single()

  if (error) return toFormState(error, 'project')

  if (previousImagePath && previousImagePath !== input.previewImagePath) {
    await deleteStoredImage(previousImagePath)
  }

  revalidateProjects(data.slug)
  if (previousSlug && previousSlug !== data.slug) revalidateProjects(previousSlug)

  return successState(
    input.status === 'published' ? 'Saved and published.' : 'Draft saved.',
    data.id
  )
}

export async function setProjectStatusAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That project could not be found.')

  const status = readStatus(formData)

  const { data, error } = await auth.context.supabase
    .from('projects')
    .update({ status })
    .eq('id', recordId)
    .select('slug')
    .single()

  if (error) return toFormState(error, 'project')

  revalidateProjects(data.slug)
  return successState(
    status === 'published' ? 'Project published.' : 'Project moved back to drafts.'
  )
}

export async function deleteProjectAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That project could not be found.')

  const { data, error } = await auth.context.supabase
    .from('projects')
    .delete()
    .eq('id', recordId)
    .select('slug, preview_image_path')
    .single()

  if (error) return toFormState(error, 'project')

  await deleteStoredImage(data.preview_image_path)
  revalidateProjects(data.slug)

  redirect('/admin/projects?deleted=1')
}
