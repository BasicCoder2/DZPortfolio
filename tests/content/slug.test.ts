import { describe, expect, it } from 'vitest'
import {
  SLUG_MAX_LENGTH,
  SLUG_PATTERN,
  ensureUniqueSlug,
  isValidSlug,
  slugifyContent,
} from '@/lib/content/slug'

describe('slugifyContent', () => {
  it('produces the slugs the existing content already uses', () => {
    // These are live URLs. Migration must not change them.
    expect(slugifyContent('LMMU Governance / Admissions Platform')).toBe(
      'lmmu-governance-admissions-platform'
    )
    expect(slugifyContent('Building Useful Systems')).toBe('building-useful-systems')
  })

  it('folds accents rather than dropping the letter', () => {
    expect(slugifyContent('Café Systems')).toBe('cafe-systems')
    expect(slugifyContent('Über Alles')).toBe('uber-alles')
  })

  it('collapses punctuation and trims separators', () => {
    expect(slugifyContent('  ---Hello_World!!!  ')).toBe('hello-world')
    expect(slugifyContent('a  --  b')).toBe('a-b')
  })

  it('always emits something the database will accept', () => {
    const inputs = [
      'Normal Title',
      '2024 in review',
      '!!!',
      'x'.repeat(300),
      'Ünïcödé — Everywhere',
      'trailing-hyphen-',
    ]

    for (const input of inputs) {
      const slug = slugifyContent(input)
      // Empty is a legitimate outcome for input with no alphanumerics at all;
      // anything non-empty must satisfy the CHECK constraint.
      if (slug !== '') expect(SLUG_PATTERN.test(slug)).toBe(true)
      expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH)
    }
  })

  it('never ends on a separator after truncation', () => {
    // The naive version sliced mid-word and left a trailing hyphen, which the
    // slug pattern rejects.
    const long = `${'word '.repeat(40)}`
    expect(slugifyContent(long).endsWith('-')).toBe(false)
  })
})

describe('isValidSlug', () => {
  it.each(['a', 'hello-world', 'post-2', 'x1'])('accepts %s', (slug) => {
    expect(isValidSlug(slug)).toBe(true)
  })

  it.each(['', '-leading', 'trailing-', 'double--hyphen', 'Upper', 'has space', 'sym!bol'])(
    'rejects %s',
    (slug) => {
      expect(isValidSlug(slug)).toBe(false)
    }
  )

  it('rejects an over-long slug', () => {
    expect(isValidSlug('a'.repeat(SLUG_MAX_LENGTH + 1))).toBe(false)
  })
})

describe('ensureUniqueSlug', () => {
  it('leaves a free slug alone', () => {
    expect(ensureUniqueSlug('my-post', ['other-post'])).toBe('my-post')
  })

  it('suffixes on collision, starting at 2', () => {
    expect(ensureUniqueSlug('my-post', ['my-post'])).toBe('my-post-2')
  })

  it('skips suffixes that are also taken', () => {
    expect(ensureUniqueSlug('my-post', ['my-post', 'my-post-2', 'my-post-3'])).toBe('my-post-4')
  })

  it('keeps the suffixed result within the length limit', () => {
    const base = 'a'.repeat(SLUG_MAX_LENGTH)
    const result = ensureUniqueSlug(base, [base])

    expect(result.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH)
    expect(SLUG_PATTERN.test(result)).toBe(true)
    expect(result).not.toBe(base)
  })

  it('still produces a valid slug under heavy collision', () => {
    const taken = ['post', ...Array.from({ length: 500 }, (_, i) => `post-${i + 2}`)]
    const result = ensureUniqueSlug('post', taken)

    expect(taken).not.toContain(result)
    expect(SLUG_PATTERN.test(result)).toBe(true)
  })
})
