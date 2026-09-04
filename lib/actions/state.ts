import type { ZodError } from 'zod'

/**
 * The shape every admin Server Action returns.
 *
 * Designed for `useActionState`: the form renders whatever came back, so a
 * failed submission keeps the operator on the page with their work intact and
 * the errors attached to the fields that caused them. Actions never throw for
 * *expected* failures (validation, a duplicate slug, an expired session) —
 * throwing would replace the form with an error boundary and lose the draft.
 */
export interface FormState {
  status: 'idle' | 'success' | 'error'
  /** Shown in the form's live region. Safe to display verbatim. */
  message: string
  /** Keyed by field name, matching the `name` attribute on the input. */
  fieldErrors: Record<string, string[]>
  /** Set by create actions so the client can navigate to the new record. */
  id?: string
}

export const idleFormState: FormState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
}

export function errorState(message: string, fieldErrors: Record<string, string[]> = {}): FormState {
  return { status: 'error', message, fieldErrors }
}

export function successState(message: string, id?: string): FormState {
  return id === undefined
    ? { status: 'success', message, fieldErrors: {} }
    : { status: 'success', message, fieldErrors: {}, id }
}

/**
 * Collapses a ZodError into `{ fieldName: [messages] }`.
 *
 * Issues raised on the object rather than a field (cross-field refinements
 * without an explicit path) are collected under `_form` so they still surface
 * somewhere instead of vanishing.
 */
export function toFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join('.') : '_form'
    const bucket = fieldErrors[key]
    if (bucket) {
      bucket.push(issue.message)
    } else {
      fieldErrors[key] = [issue.message]
    }
  }

  return fieldErrors
}

/** First message for a field, for rendering under an input. */
export function firstError(
  fieldErrors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  return fieldErrors?.[field]?.[0]
}
