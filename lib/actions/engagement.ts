'use server'

import { requireAdminForAction } from '@/lib/auth/admin'
import { engagementSchema } from '@/lib/content/schemas'
import { revalidateHomeSections } from '@/lib/content/cache'
import { errorState, successState, toFieldErrors, type FormState } from '@/lib/actions/state'
import { toFormState } from '@/lib/actions/db-errors'
import { field, flag, id as parseId } from '@/lib/actions/form'

/**
 * Engagement (pricing) mutations.
 *
 * The public cards read whatever is saved here, so a price change goes live as
 * soon as the homepage is revalidated — no redeploy, which is the whole point
 * of moving pricing out of `data/pricing.ts`.
 */

const CURRENCIES = ['label', 'USD', 'ZMW', 'BOTH'] as const

function readCurrency(formData: FormData): string {
  const value = formData.get('currency')
  return typeof value === 'string' && (CURRENCIES as readonly string[]).includes(value)
    ? value
    : 'label'
}

export async function saveEngagementAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const parsed = engagementSchema.safeParse({
    slug: field(formData, 'slug'),
    title: field(formData, 'title'),
    description: field(formData, 'description'),
    items: field(formData, 'items'),
    pricePrefix: field(formData, 'pricePrefix'),
    priceLabel: field(formData, 'priceLabel'),
    priceUsd: field(formData, 'priceUsd'),
    priceZmw: field(formData, 'priceZmw'),
    currency: readCurrency(formData),
    recommended: flag(formData, 'recommended'),
    displayOrder: field(formData, 'displayOrder'),
    published: flag(formData, 'published'),
  })

  if (!parsed.success) {
    return errorState('Check the highlighted fields.', toFieldErrors(parsed.error))
  }

  const input = parsed.data
  const row = {
    slug: input.slug,
    title: input.title,
    description: input.description,
    items: input.items,
    price_prefix: input.pricePrefix,
    price_label: input.priceLabel,
    price_usd: input.priceUsd,
    price_zmw: input.priceZmw,
    currency: input.currency,
    recommended: input.recommended,
    display_order: input.displayOrder,
    published: input.published,
  }

  const recordId = parseId(formData)

  const { error } =
    recordId === null
      ? await auth.context.supabase.from('engagement_options').insert(row)
      : await auth.context.supabase.from('engagement_options').update(row).eq('id', recordId)

  if (error) return toFormState(error, 'engagement')

  revalidateHomeSections()
  return successState(recordId === null ? 'Engagement option added.' : 'Pricing saved.')
}

export async function setEngagementVisibilityAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That option could not be found.')

  const published = flag(formData, 'published')

  const { error } = await auth.context.supabase
    .from('engagement_options')
    .update({ published })
    .eq('id', recordId)

  if (error) return toFormState(error, 'engagement')

  revalidateHomeSections()
  return successState(published ? 'Option is now visible.' : 'Option hidden from the site.')
}

export async function deleteEngagementAction(
  _previous: FormState,
  formData: FormData
): Promise<FormState> {
  const auth = await requireAdminForAction()
  if (!auth.ok) return errorState(auth.message)

  const recordId = parseId(formData)
  if (recordId === null) return errorState('That option could not be found.')

  const { error } = await auth.context.supabase
    .from('engagement_options')
    .delete()
    .eq('id', recordId)

  if (error) return toFormState(error, 'engagement')

  revalidateHomeSections()
  return successState('Engagement option deleted.')
}
