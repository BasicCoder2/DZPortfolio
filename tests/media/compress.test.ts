import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { MAX_IMAGE_WIDTH, compressImage } from '@/lib/media/compress'

/**
 * A photo-like RGB image: blurred noise. PNG stores it losslessly and stays
 * large, the way it does a full-resolution screenshot or photograph, while a
 * lossy encoder can shrink it. (Pure noise would defeat every encoder.)
 */
async function noisyPng(width: number, height: number): Promise<Buffer> {
  const pixels = Buffer.alloc(width * height * 3)
  for (let i = 0; i < pixels.length; i++) pixels[i] = (Math.imul(i, 2654435761) >>> 24) & 0xff
  const blurred = await sharp(pixels, { raw: { width, height, channels: 3 } })
    .blur(1.5)
    .raw()
    .toBuffer()
  return sharp(blurred, { raw: { width, height, channels: 3 } }).png().toBuffer()
}

describe('compressImage', () => {
  it('re-encodes a large PNG as a smaller WebP capped at the maximum width', async () => {
    const source = await noisyPng(3000, 1700)
    const result = await compressImage(source, 'image/png')

    expect(result.type).toBe('image/webp')
    expect(result.extension).toBe('webp')
    expect(result.data.byteLength).toBeLessThan(source.byteLength)

    const meta = await sharp(result.data).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(MAX_IMAGE_WIDTH)
    // Aspect ratio survives the resize.
    expect(meta.height).toBe(Math.round((1700 / 3000) * MAX_IMAGE_WIDTH))
  })

  it('never upscales an image narrower than the cap', async () => {
    const source = await noisyPng(800, 450)
    const result = await compressImage(source, 'image/png')
    const meta = await sharp(result.data).metadata()
    expect(meta.width).toBe(800)
  })

  it('keeps the original when re-encoding would not make it smaller', async () => {
    // A tiny, already-compressed WebP: re-encoding cannot win.
    const source = await sharp({
      create: { width: 40, height: 40, channels: 3, background: '#0f766e' },
    })
      .webp({ quality: 40 })
      .toBuffer()
    const result = await compressImage(source, 'image/webp')

    expect(result.type).toBe('image/webp')
    expect(result.data.equals(source)).toBe(true)
  })

  it('passes GIFs through untouched so animation is preserved', async () => {
    const source = await sharp({
      create: { width: 20, height: 20, channels: 3, background: '#ffffff' },
    })
      .gif()
      .toBuffer()
    const result = await compressImage(source, 'image/gif')

    expect(result.type).toBe('image/gif')
    expect(result.extension).toBe('gif')
    expect(result.data.equals(source)).toBe(true)
  })

  it('falls back to the original bytes when the image cannot be decoded', async () => {
    // A valid PNG signature followed by garbage: passes the magic-number check,
    // fails to decode.
    const source = Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      Buffer.alloc(64, 7),
    ])
    const result = await compressImage(source, 'image/png')

    expect(result.type).toBe('image/png')
    expect(result.data.equals(source)).toBe(true)
  })
})
