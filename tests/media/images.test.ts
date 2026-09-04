import { describe, expect, it } from 'vitest'
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  buildImagePath,
  isAllowedImageType,
  isDeletableObjectPath,
  resolveImageUrl,
  validateImage,
} from '@/lib/media/images'

/** First 16 bytes of a file, padded, so `validateImage` has a header to read. */
function header(bytes: number[]): Uint8Array {
  const out = new Uint8Array(16)
  out.set(bytes.slice(0, 16))
  return out
}

const PNG = header([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const JPEG = header([0xff, 0xd8, 0xff, 0xe0])
const GIF = header([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
const WEBP = header([0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50])
const AVIF = header([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66])

describe('validateImage', () => {
  it.each([
    ['image/png', PNG],
    ['image/jpeg', JPEG],
    ['image/gif', GIF],
    ['image/webp', WEBP],
    ['image/avif', AVIF],
  ])('accepts a well-formed %s', (type, bytes) => {
    const result = validateImage(type, 1024, bytes)
    expect(result.ok).toBe(true)
  })

  it('returns the extension to store the object under', () => {
    const result = validateImage('image/jpeg', 1024, JPEG)
    expect(result.ok && result.extension).toBe('jpg')
  })

  it.each(['image/svg+xml', 'text/html', 'application/pdf', 'application/x-msdownload', ''])(
    'rejects the disallowed type %s',
    (type) => {
      // SVG is the important one: it is an XML document that can carry script,
      // and it would run from the storage origin.
      const result = validateImage(type, 1024, PNG)
      expect(result.ok).toBe(false)
    }
  )

  it('rejects a file whose bytes contradict its declared type', () => {
    // The classic bypass: rename payload.html to photo.png and set the MIME
    // type by hand. The declared type is a claim; the header is evidence.
    const html = header([0x3c, 0x21, 0x44, 0x4f, 0x43, 0x54, 0x59, 0x50, 0x45, 0x20, 0x68, 0x74])
    const result = validateImage('image/png', 1024, html)

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/not a valid image/i)
  })

  it('rejects a JPEG header submitted as a PNG', () => {
    expect(validateImage('image/png', 1024, JPEG).ok).toBe(false)
  })

  it('rejects an oversized file', () => {
    const result = validateImage('image/png', MAX_IMAGE_BYTES + 1, PNG)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/5 MB or smaller/)
  })

  it('accepts a file exactly at the limit', () => {
    expect(validateImage('image/png', MAX_IMAGE_BYTES, PNG).ok).toBe(true)
  })

  it('rejects an empty file', () => {
    expect(validateImage('image/png', 0, PNG).ok).toBe(false)
  })

  it('fails closed on a truncated header', () => {
    expect(validateImage('image/png', 4, new Uint8Array([0x89, 0x50])).ok).toBe(false)
  })
})

describe('isAllowedImageType', () => {
  it('matches the exported allowlist', () => {
    for (const type of ALLOWED_IMAGE_TYPES) expect(isAllowedImageType(type)).toBe(true)
    expect(isAllowedImageType('image/svg+xml')).toBe(false)
  })
})

describe('buildImagePath', () => {
  const when = new Date('2026-09-04T10:00:00Z')

  it('namespaces by folder and date, and keeps the extension', () => {
    const path = buildImagePath('posts', 'webp', when, 'fixed-id')
    expect(path).toBe('posts/2026/09/fixed-id.webp')
  })

  it('discards the original filename entirely', () => {
    // Nothing user-controlled reaches the storage key, which removes traversal,
    // case-folding collisions and unicode-lookalike problems by construction.
    const path = buildImagePath('projects', 'png', when, 'fixed-id')
    expect(path).not.toMatch(/\.\./)
    expect(path).toBe('projects/2026/09/fixed-id.png')
  })

  it('produces a different path each time by default', () => {
    const a = buildImagePath('posts', 'webp')
    const b = buildImagePath('posts', 'webp')
    expect(a).not.toBe(b)
  })
})

describe('isDeletableObjectPath', () => {
  it.each([
    'posts/2026/09/abc.webp',
    'projects/2025/01/def.png',
    'certifications/2024/12/ghi.avif',
  ])('accepts the managed path %s', (path) => {
    expect(isDeletableObjectPath(path)).toBe(true)
  })

  it.each([
    ['an absolute URL', 'https://cdn.example.com/a.png'],
    ['a bundled public asset', '/assets/projects/fase-plaza.svg'],
    ['a traversal attempt', 'posts/../../../etc/passwd'],
    ['an unmanaged prefix', 'avatars/2026/09/a.webp'],
    ['empty', ''],
    ['null', null],
  ])('refuses %s', (_label, path) => {
    // Deletion is the destructive half of "replace an image". Anything this
    // code did not create is not its to remove.
    expect(isDeletableObjectPath(path)).toBe(false)
  })
})

describe('resolveImageUrl', () => {
  it('passes an absolute URL through', () => {
    expect(resolveImageUrl('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })

  it('passes a bundled public asset through', () => {
    // The migrated project artwork still lives under public/.
    expect(resolveImageUrl('/assets/projects/fase-plaza.svg')).toBe(
      '/assets/projects/fase-plaza.svg'
    )
  })

  it('returns null for absent values', () => {
    expect(resolveImageUrl(null)).toBeNull()
    expect(resolveImageUrl('')).toBeNull()
    expect(resolveImageUrl('   ')).toBeNull()
  })

  it('builds a public storage URL when Supabase is configured', () => {
    const previous = process.env.NEXT_PUBLIC_SUPABASE_URL
    const previousKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    try {
      expect(resolveImageUrl('posts/2026/09/a.webp')).toBe(
        'https://project.supabase.co/storage/v1/object/public/content-images/posts/2026/09/a.webp'
      )
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
      else process.env.NEXT_PUBLIC_SUPABASE_URL = previous
      if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = previousKey
    }
  })
})
