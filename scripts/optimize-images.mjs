#!/usr/bin/env node
/**
 * Re-encodes oversized bundled images.
 *
 * The hero portrait shipped as a 3.56 MB PNG. next/image can serve a smaller
 * derivative, but the *source* still has to be fetched and decoded by the
 * optimizer on a cold cache, and it sits in the repository and in every deploy
 * artifact at full size. Re-encoding at source fixes all three.
 *
 * Produces AVIF and WebP siblings and leaves the original in place, so the
 * `<picture>`-style fallback chain still has something to fall back to and the
 * change is reversible.
 *
 * Usage: pnpm images:optimize
 */

import { readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join } from 'node:path'
import sharp from 'sharp'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

/**
 * Targets, with the widest size each is ever displayed at.
 *
 * The hero renders inside a `max-w-[31rem]` frame at 92% width — roughly 456
 * CSS pixels — so 1200px covers a 2x display with room to spare. The original
 * was far larger than anything the layout could use.
 */
const TARGETS = [
  {
    source: 'public/assets/portrait/daniel-zimba-hero.png',
    maxWidth: 1200,
  },
  {
    source: 'public/assets/portrait/daniel-zimba-avatar.jpg',
    maxWidth: 640,
  },
]

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function sizeOf(path) {
  try {
    return (await stat(path)).size
  } catch {
    return null
  }
}

async function optimize({ source, maxWidth }) {
  const absolute = join(root, source)
  const original = await sizeOf(absolute)

  if (original === null) {
    console.log(`  skip   ${source} (not found)`)
    return
  }

  const base = absolute.slice(0, -extname(absolute).length)
  const image = sharp(absolute)
  const { width, height } = await image.metadata()

  // withoutEnlargement: re-encoding must never upscale a source that is
  // already smaller than the target.
  const resized = () => sharp(absolute).resize({ width: maxWidth, withoutEnlargement: true })

  await resized().avif({ quality: 62, effort: 6 }).toFile(`${base}.avif`)
  await resized().webp({ quality: 82, effort: 6 }).toFile(`${base}.webp`)

  const avif = await sizeOf(`${base}.avif`)
  const webp = await sizeOf(`${base}.webp`)

  console.log(`  ${source}`)
  console.log(`    source ${String(width)}x${String(height)}  ${formatBytes(original)}`)
  console.log(`    avif   ${formatBytes(avif ?? 0)}  (${percent(avif, original)} smaller)`)
  console.log(`    webp   ${formatBytes(webp ?? 0)}  (${percent(webp, original)} smaller)`)
}

function percent(next, original) {
  if (!next || !original) return '—'
  return `${Math.round((1 - next / original) * 100)}%`
}

async function main() {
  console.log('\n  Optimizing bundled images\n')
  for (const target of TARGETS) await optimize(target)

  const dir = join(root, 'public/assets/portrait')
  const files = await readdir(dir)
  console.log(`\n  public/assets/portrait now contains: ${files.join(', ')}\n`)
}

main().catch((error) => {
  console.error(`\n  Image optimization failed: ${error.message}\n`)
  process.exit(1)
})
