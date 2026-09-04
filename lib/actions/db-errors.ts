import type { PostgrestError } from '@supabase/supabase-js'
import { errorState, type FormState } from '@/lib/actions/state'

/**
 * Translates a PostgREST failure into something an operator can act on.
 *
 * The database is the last line of every rule the Zod schemas also enforce, so
 * reaching this code usually means one of two things: a genuine race (two
 * saves claiming the same slug at once), or a constraint the application layer
 * does not yet mirror. Both deserve a specific message rather than "something
 * went wrong".
 *
 * The raw `error.message` is deliberately not shown. It carries table and
 * constraint names, and while the admin is the only one who can trigger these,
 * echoing database internals into a rendered page is a habit worth not having.
 */

/** unique_violation */
const UNIQUE_VIOLATION = '23505'
/** check_violation */
const CHECK_VIOLATION = '23514'
/** insufficient_privilege — what RLS returns when a policy refuses a write. */
const RLS_DENIED = '42501'

interface ConstraintMapping {
  /** Substring matched against the constraint or index name in the message. */
  match: string
  field: string
  message: string
}

const POST_CONSTRAINTS: ConstraintMapping[] = [
  {
    match: 'posts_slug_key',
    field: 'slug',
    message: 'Another post already uses that slug. Pick a different one.',
  },
  {
    match: 'posts_cover_image_needs_alt',
    field: 'coverImageAlt',
    message: 'Describe the cover image for screen readers before saving it.',
  },
]

const PROJECT_CONSTRAINTS: ConstraintMapping[] = [
  {
    match: 'projects_slug_key',
    field: 'slug',
    message: 'Another project already uses that slug. Pick a different one.',
  },
  {
    match: 'projects_preview_image_needs_alt',
    field: 'previewImageAlt',
    message: 'Describe the preview image for screen readers before saving it.',
  },
]

const EXPERIENCE_CONSTRAINTS: ConstraintMapping[] = [
  {
    match: 'experience_org_role_start_key',
    field: 'organization',
    message: 'An entry for that organization, role and start date already exists.',
  },
  {
    match: 'experience_dates_ordered',
    field: 'endDate',
    message: 'The end date cannot come before the start date.',
  },
  {
    match: 'experience_current_has_no_end',
    field: 'endDate',
    message: 'A current role cannot have an end date.',
  },
]

const CERTIFICATION_CONSTRAINTS: ConstraintMapping[] = [
  {
    match: 'certifications_title_issuer_key',
    field: 'title',
    message: 'That certification is already recorded for this issuer.',
  },
  {
    match: 'certifications_image_needs_alt',
    field: 'imageAlt',
    message: 'Describe the image for screen readers before saving it.',
  },
]

const ENGAGEMENT_CONSTRAINTS: ConstraintMapping[] = [
  {
    match: 'engagement_options_slug_key',
    field: 'slug',
    message: 'Another engagement option already uses that slug.',
  },
  {
    match: 'engagement_price_source_present',
    field: 'currency',
    message: 'Fill in the amount for the currency you chose to display.',
  },
]

export type ConstraintSet = 'post' | 'project' | 'experience' | 'certification' | 'engagement'

const SETS: Record<ConstraintSet, ConstraintMapping[]> = {
  post: POST_CONSTRAINTS,
  project: PROJECT_CONSTRAINTS,
  experience: EXPERIENCE_CONSTRAINTS,
  certification: CERTIFICATION_CONSTRAINTS,
  engagement: ENGAGEMENT_CONSTRAINTS,
}

export function toFormState(error: PostgrestError, set: ConstraintSet): FormState {
  const haystack = `${error.message} ${error.details ?? ''}`

  if (error.code === UNIQUE_VIOLATION || error.code === CHECK_VIOLATION) {
    const mapping = SETS[set].find((entry) => haystack.includes(entry.match))
    if (mapping) return errorState(mapping.message, { [mapping.field]: [mapping.message] })
  }

  if (error.code === RLS_DENIED) {
    // The row-level policy refused the write. Either the session is not the
    // administrator, or grant-admin.sql was never run against this project.
    return errorState(
      'The database refused that change. Confirm this account is the administrator ' +
        'and that the admin grant has been applied.'
    )
  }

  console.error(`[admin] ${set} write failed (${error.code}): ${error.message}`)
  return errorState('That change could not be saved. Try again.')
}
