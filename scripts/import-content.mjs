#!/usr/bin/env node
/**
 * One-off import of the pre-migration static content into Supabase.
 *
 * Usage:
 *   pnpm content:import           # apply
 *   pnpm content:import --dry-run # report what would change, write nothing
 *
 * ## Idempotency
 *
 * Every table is matched on its natural key — slug for posts, projects and
 * engagement options; (organization, role, start date) for experience;
 * (title, issuer) for certifications — and the row is inserted or updated
 * accordingly. Running this twice produces the same database as running it
 * once. That is the property the whole script is built around, because a
 * content import is exactly the kind of thing someone runs again after it
 * half-failed.
 *
 * Updates deliberately do **not** overwrite `status`/`published` on rows that
 * already exist. Once a human has published or unpublished something, a
 * re-import must not undo that decision.
 *
 * ## Credentials
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY, because the import writes rows that RLS
 * reserves for the administrator and this runs outside a browser session.
 *
 * That key is **script-only**. No application code reads it, it must never be
 * set in Vercel, and it should live in .env.local on the maintainer's machine
 * only. It bypasses every Row-Level Security policy in the project; treat it
 * like the database password it effectively is.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { config as loadEnv } from 'dotenv'

const here = dirname(fileURLToPath(import.meta.url))

// .env.local first so it wins, matching how Next.js resolves these.
loadEnv({ path: join(here, '..', '.env.local'), quiet: true })
loadEnv({ path: join(here, '..', '.env'), quiet: true })

const DRY_RUN = process.argv.includes('--dry-run')

function fail(message) {
  console.error(`\n  ${message}\n`)
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!url) fail('NEXT_PUBLIC_SUPABASE_URL is not set.')
if (!serviceKey) {
  fail(
    'SUPABASE_SERVICE_ROLE_KEY is not set.\n' +
      '  Find it in Supabase under Settings -> API -> service_role.\n' +
      '  Put it in .env.local. Never commit it, and never add it to Vercel.'
  )
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const summary = []

/**
 * Inserts or updates one row, matched on `match`.
 *
 * @param table        target table
 * @param match        column/value pairs identifying an existing row
 * @param row          full column set for an insert
 * @param preserveKeys columns to leave alone when the row already exists
 */
async function upsertRow(table, match, row, preserveKeys = []) {
  let query = supabase.from(table).select('id').limit(1)
  for (const [column, value] of Object.entries(match)) {
    query = value === null ? query.is(column, null) : query.eq(column, value)
  }

  const { data: existing, error: findError } = await query.maybeSingle()
  if (findError) throw new Error(`${table}: lookup failed — ${findError.message}`)

  const label = Object.values(match).filter(Boolean).join(' / ')

  if (existing) {
    const update = { ...row }
    for (const key of preserveKeys) delete update[key]

    if (DRY_RUN) return { action: 'update', label }

    const { error } = await supabase.from(table).update(update).eq('id', existing.id)
    if (error) throw new Error(`${table}: update of "${label}" failed — ${error.message}`)
    return { action: 'update', label }
  }

  if (DRY_RUN) return { action: 'insert', label }

  const { error } = await supabase.from(table).insert(row)
  if (error) throw new Error(`${table}: insert of "${label}" failed — ${error.message}`)
  return { action: 'insert', label }
}

async function importTable(table, rows, matchOf, preserveKeys) {
  let inserted = 0
  let updated = 0

  for (const row of rows) {
    const result = await upsertRow(table, matchOf(row), row, preserveKeys)
    if (result.action === 'insert') inserted += 1
    else updated += 1
    console.log(`    ${result.action === 'insert' ? '+' : '~'} ${result.label}`)
  }

  summary.push({ table, inserted, updated, total: rows.length })
}

async function main() {
  const raw = await readFile(join(here, 'legacy-content.json'), 'utf8')
  const content = JSON.parse(raw)

  console.log(`\n  Importing legacy content into ${new URL(url).hostname}`)
  if (DRY_RUN) console.log('  DRY RUN — nothing will be written.\n')
  else console.log('')

  console.log('  projects')
  await importTable('projects', content.projects, (row) => ({ slug: row.slug }), [
    'status',
    'featured',
    'display_order',
  ])

  console.log('  posts')
  await importTable('posts', content.posts, (row) => ({ slug: row.slug }), ['status'])

  console.log('  experience_entries')
  await importTable(
    'experience_entries',
    content.experience_entries,
    (row) => ({
      organization: row.organization,
      role: row.role,
      start_date: row.start_date,
    }),
    ['published', 'display_order']
  )

  console.log('  certifications')
  await importTable(
    'certifications',
    content.certifications,
    (row) => ({ title: row.title, issuer: row.issuer }),
    ['published', 'display_order']
  )

  console.log('  engagement_options')
  await importTable(
    'engagement_options',
    content.engagement_options,
    (row) => ({ slug: row.slug }),
    ['published', 'display_order', 'recommended']
  )

  console.log('\n  Summary')
  for (const entry of summary) {
    console.log(
      `    ${entry.table.padEnd(20)} ${entry.inserted} inserted, ${entry.updated} updated ` +
        `(${entry.total} in snapshot)`
    )
  }

  console.log(
    '\n  Notes\n' +
      '    * "Building Useful Systems" is imported as a DRAFT. Its body is still\n' +
      '      marked as placeholder editorial content, so it is not published.\n' +
      '    * Project case-study bodies are empty. The public page renders its own\n' +
      '      "documentation is being prepared" empty state, so nothing regressed —\n' +
      '      but no placeholder prose was written to the database.\n' +
      '    * Experience entries and certifications have no dates, because the\n' +
      '      source recorded none. Add them in the admin area when known.\n'
  )

  if (DRY_RUN) console.log('  Dry run complete. Nothing was written.\n')
  else console.log('  Import complete.\n')
}

main().catch((error) => {
  console.error(`\n  Import failed: ${error.message}\n`)
  process.exit(1)
})
