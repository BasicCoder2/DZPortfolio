import { getSupabaseConfig } from '@/lib/env'

/**
 * Image upload rules and URL resolution for Supabase Storage.
 *
 * Nothing in this module talks to the network — it is pure policy, so the
 * validation rules can be unit-tested without a Supabase project.
 */

export const IMAGE_BUCKET = 'content-images'

/** Mirrors the bucket's `file_size_limit` in 0003_storage.sql. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

/**
 * The only types accepted. An allowlist, not a denylist: SVG is deliberately
 * absent because it is an XML document that can carry script, and a stored SVG
 * served from the storage origin would run there.
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number]

const EXTENSION_BY_TYPE: Record<AllowedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

/**
 * File signatures, checked against the first bytes of the upload.
 *
 * The browser-supplied MIME type is a claim, not evidence — anyone can rename
 * `payload.html` to `photo.png` and set the type by hand. Comparing the actual
 * leading bytes is what makes "reject executable or misleading formats" true
 * rather than aspirational.
 */
const MAGIC_NUMBERS: Record<AllowedImageType, (bytes: Uint8Array) => boolean> = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) =>
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a,
  'image/gif': (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38,
  // RIFF....WEBP
  'image/webp': (b) =>
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50,
  // ISO-BMFF box: ....ftyp
  'image/avif': (b) => b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70,
}

export type ImageValidationResult =
  { ok: true; type: AllowedImageType; extension: string } | { ok: false; message: string }

export function isAllowedImageType(type: string): type is AllowedImageType {
  return (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)
}

/**
 * Validates a candidate upload from its declared type, size and leading bytes.
 *
 * @param header the first 16 bytes of the file; shorter input fails closed
 */
export function validateImage(
  declaredType: string,
  size: number,
  header: Uint8Array
): ImageValidationResult {
  if (size <= 0) {
    return { ok: false, message: 'That file is empty.' }
  }
  if (size > MAX_IMAGE_BYTES) {
    const limitMb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024))
    return { ok: false, message: `Images must be ${limitMb} MB or smaller.` }
  }
  if (!isAllowedImageType(declaredType)) {
    return {
      ok: false,
      message: 'Upload a JPEG, PNG, WebP, AVIF or GIF image.',
    }
  }
  if (header.length < 12) {
    return { ok: false, message: 'That file is too short to be a valid image.' }
  }
  if (!MAGIC_NUMBERS[declaredType](header)) {
    return {
      ok: false,
      message: 'That file is not a valid image, or its contents do not match its extension.',
    }
  }

  return { ok: true, type: declaredType, extension: EXTENSION_BY_TYPE[declaredType] }
}

/**
 * Builds a collision-resistant object path.
 *
 * The original filename is discarded rather than sanitized. Reusing it would
 * mean carrying user-controlled text into a storage key, and every bug class
 * that follows (traversal, case-folding collisions, unicode lookalikes) exists
 * only because the name was kept. The date prefix is for human browsing of the
 * bucket; the random segment is what guarantees uniqueness.
 *
 * @param folder logical grouping, e.g. `posts` or `projects`
 * @param randomId injected for deterministic tests
 */
export function buildImagePath(
  folder: 'posts' | 'projects' | 'certifications',
  extension: string,
  now: Date = new Date(),
  randomId: string = crypto.randomUUID()
): string {
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${folder}/${year}/${month}/${randomId}.${extension}`
}

/**
 * Resolves a stored value to something an `<img>` can load.
 *
 * Rows hold a bucket-relative object path (`posts/2026/09/uuid.webp`), which
 * is the stable identifier — it survives a project URL change and keeps the
 * database free of environment-specific hostnames. Absolute URLs are passed
 * through unchanged so content imported from elsewhere still renders.
 */
export function resolveImageUrl(path: string | null | undefined): string | null {
  if (typeof path !== 'string') return null
  const trimmed = path.trim()
  if (trimmed === '') return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/')) return trimmed // bundled asset under public/

  const config = getSupabaseConfig()
  if (!config) return null

  const base = config.url.replace(/\/+$/, '')
  return `${base}/storage/v1/object/public/${IMAGE_BUCKET}/${trimmed}`
}

/**
 * True when the value is a bucket object path this app is allowed to delete.
 *
 * Guards the cleanup step in the mutation layer: an absolute URL or a
 * `public/` asset is not ours to remove, and a path containing `..` is not a
 * path we produced.
 */
export function isDeletableObjectPath(path: string | null | undefined): path is string {
  if (typeof path !== 'string') return false
  const trimmed = path.trim()
  if (trimmed === '') return false
  if (/^https?:\/\//i.test(trimmed)) return false
  if (trimmed.startsWith('/')) return false
  if (trimmed.includes('..')) return false
  return /^(posts|projects|certifications)\/[A-Za-z0-9/_.-]+$/.test(trimmed)
}
