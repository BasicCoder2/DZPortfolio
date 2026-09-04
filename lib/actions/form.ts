/**
 * FormData helpers.
 *
 * `FormData.get` returns `string | File | null`. The content schemas accept
 * `string | null | undefined`, so a stray `File` — which is what arrives if a
 * file input shares a name with a text field — would blow past validation as
 * an object. `field` collapses that to `null`, which every schema treats as
 * "not provided".
 */

export function field(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  return typeof value === 'string' ? value : null
}

/**
 * Checkboxes submit `'on'` when checked and nothing at all when not, so the
 * absence of the key is the `false` case.
 */
export function flag(formData: FormData, key: string): boolean {
  const value = formData.get(key)
  return value === 'on' || value === 'true' || value === '1'
}

/** A required identifier, or `null` when absent or malformed. */
export function id(formData: FormData, key = 'id'): string | null {
  const value = field(formData, key)
  if (value === null) return null
  const trimmed = value.trim()
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed)
    ? trimmed
    : null
}
