import sharp from 'sharp'
import type { AllowedImageType } from '@/lib/media/images'

/**
 * Server-side re-encoding for content image uploads.
 *
 * Uploads used to be stored exactly as chosen, so a full-resolution PNG
 * screenshot went into the bucket at 2–3 MB. next/image only ever serves a
 * resized derivative, but on a cold cache its optimizer still has to fetch and
 * decode the whole source from Storage, and with sources that size it timed
 * out and returned 500s. Shrinking the stored file fixes the cause rather than
 * the symptom, and it is the same treatment the bundled hero portrait gets
 * from `pnpm images:optimize`.
 */

/**
 * Widest stored size. Project images render at up to two-thirds of a 1440px
 * layout (~950 CSS pixels), so 2000 covers a 2x display without waste.
 */
export const MAX_IMAGE_WIDTH = 2000

/** Visually lossless for screenshots and photos at a fraction of PNG's size. */
const WEBP_QUALITY = 82

export interface CompressedImage {
  data: Buffer
  type: AllowedImageType
  extension: string
}

const EXTENSION: Record<AllowedImageType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

/**
 * Resizes to at most `MAX_IMAGE_WIDTH` and re-encodes as WebP.
 *
 * Expects input that has already passed `validateImage`. The original bytes
 * are returned unchanged when:
 *
 * - the image is a GIF, which may be animated and would lose its frames;
 * - re-encoding would not make it smaller (an already-optimized WebP/AVIF);
 * - the image cannot be decoded. Validation has already confirmed the type
 *   from its signature, so this keeps uploads working exactly as before
 *   rather than blocking the admin over a processing problem.
 */
export async function compressImage(
  input: Buffer,
  type: AllowedImageType
): Promise<CompressedImage> {
  const original: CompressedImage = { data: input, type, extension: EXTENSION[type] }
  if (type === 'image/gif') return original

  try {
    const output = await sharp(input)
      // Applies EXIF orientation before metadata is dropped, so phone photos
      // are not stored sideways. Metadata (including GPS) is stripped by
      // default, which is the right outcome for public images anyway.
      .rotate()
      .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer()

    if (output.byteLength >= input.byteLength) return original
    return { data: output, type: 'image/webp', extension: 'webp' }
  } catch (error) {
    console.error('[media] image compression failed; storing the original', error)
    return original
  }
}
