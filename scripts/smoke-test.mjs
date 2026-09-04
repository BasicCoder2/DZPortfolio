/**
 * HTTP smoke test against a running build.
 *
 * Usage:
 *   pnpm build && pnpm start --port 3105
 *   SMOKE_BASE_URL=http://127.0.0.1:3105 pnpm smoke
 *
 * Content routes are **discovered from the sitemap** rather than hardcoded.
 * They used to be a fixed list of four project slugs and one post, which was
 * fine when those lived in a TypeScript file and wrong the moment content moved
 * to a database: the list would fail on a fresh deployment with no content, and
 * would silently stop covering anything published afterwards.
 *
 * The admin checks are the other half. A smoke test that only proves pages load
 * would pass just as happily if /admin were wide open.
 */

const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3105'

let failed = false

function report(ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${detail}`)
  if (!ok) failed = true
}

async function expectOk(route) {
  try {
    const response = await fetch(new URL(route, baseUrl))
    report(response.ok, `${response.status} ${route}`)
    return response
  } catch (error) {
    report(false, `request ${route}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

/** Reads published URLs out of the sitemap, so coverage tracks real content. */
async function contentRoutesFromSitemap() {
  try {
    const response = await fetch(new URL('/sitemap.xml', baseUrl))
    if (!response.ok) return []

    const xml = await response.text()
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((path) => path.startsWith('/blog/') || path.startsWith('/projects/'))
  } catch {
    return []
  }
}

/**
 * The admin interface must never be rendered to an anonymous request.
 *
 * Two outcomes are acceptable, and which one you get depends on the
 * deployment:
 *
 *   * a redirect to /admin/login — the normal case, Supabase configured;
 *   * a 200 carrying the "not connected / not configured" notice — a preview
 *     deployment whose environment variables have not been filled in.
 *
 * What is never acceptable is the actual admin shell. That is what the marker
 * check looks for, so this test cannot be satisfied by a page that merely
 * returns a 200.
 */
const ADMIN_SHELL_MARKER = 'aria-label="Admin sections"'

async function expectProtected(route) {
  try {
    const response = await fetch(new URL(route, baseUrl), { redirect: 'manual' })
    const location = response.headers.get('location') ?? ''

    if (response.status >= 300 && response.status < 400) {
      report(location.includes('/admin/login'), `${response.status} ${route} -> ${location}`)
      return
    }

    if (response.status === 200) {
      const body = await response.text()
      const leaked = body.includes(ADMIN_SHELL_MARKER)
      report(!leaked, `200 ${route} -> ${leaked ? 'ADMIN UI EXPOSED' : 'notice page (no admin UI)'}`)
      return
    }

    report(false, `${response.status} ${route} -> unexpected status`)
  } catch (error) {
    report(false, `request ${route}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

console.log(`\nSmoke testing ${baseUrl}\n`)

console.log('Public routes')
for (const route of ['/', '/projects', '/blog', '/me', '/robots.txt', '/sitemap.xml']) {
  await expectOk(route)
}

console.log('\nPublished content (from sitemap)')
const contentRoutes = await contentRoutesFromSitemap()
if (contentRoutes.length === 0) {
  console.log('SKIP no published posts or projects yet')
} else {
  for (const route of contentRoutes) await expectOk(route)
}

console.log('\nAdmin protection')
await expectOk('/admin/login')
for (const route of ['/admin', '/admin/blog', '/admin/projects', '/admin/blog/new']) {
  await expectProtected(route)
}

console.log('')
if (failed) {
  console.error(`Smoke test failed for ${baseUrl}\n`)
  process.exitCode = 1
} else {
  console.log(`Smoke test passed for ${baseUrl}\n`)
}
