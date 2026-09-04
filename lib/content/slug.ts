/**
 * Slug generation and collision handling.
 *
 * The output must satisfy the database constraint
 * `slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'` (see 0001_content_schema.sql). Keeping
 * that pattern in one exported constant means the application and the schema
 * cannot drift into disagreeing about what a valid slug is.
 */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const SLUG_MAX_LENGTH = 96

/**
 * Combining diacritical marks (U+0300–U+036F), which NFKD normalization splits
 * off from accented letters.
 *
 * Built from a string rather than written as a regex literal so the source
 * stays plain ASCII — a literal here would contain raw combining characters
 * that render as invisible garbage in a diff.
 */
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g')

/**
 * Turns arbitrary text into a URL-safe slug.
 *
 * Unlike the general-purpose `slugify` in lib/utils.ts, this one decomposes
 * accents first, so "Café Systems" becomes `cafe-systems` rather than losing
 * the character entirely, and it guarantees the result matches
 * {@link SLUG_PATTERN} or is empty.
 */
export function slugifyContent(value: string): string {
  return value
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '') // strip the marks NFKD split off
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/g, '') // the slice may have landed mid-separator
}

export function isValidSlug(value: string): boolean {
  return value.length > 0 && value.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(value)
}

/**
 * Returns `desired` if it is free, otherwise the first `desired-2`,
 * `desired-3`, ... that is not taken.
 *
 * Numbering starts at 2 because `-1` reads as "the first one" and invites the
 * question of where `post` versus `post-1` differ.
 *
 * This is a convenience for the admin form, not the uniqueness guarantee. The
 * guarantee is the unique index on the column: two administrators saving at
 * once would both see a free slug here and one of them would still be
 * rejected by the database, which the mutation layer surfaces as a field
 * error rather than a crash.
 */
export function ensureUniqueSlug(desired: string, taken: Iterable<string>): string {
  const used = new Set(taken)
  if (!used.has(desired)) return desired

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const tail = `-${suffix}`
    const base = desired.slice(0, SLUG_MAX_LENGTH - tail.length).replace(/-+$/g, '')
    const candidate = `${base}${tail}`
    if (!used.has(candidate)) return candidate
  }

  // 998 collisions on one title is not a real scenario; falling back to a
  // timestamp beats looping forever or returning a duplicate.
  return `${desired.slice(0, SLUG_MAX_LENGTH - 14).replace(/-+$/g, '')}-${Date.now().toString(36)}`
}
