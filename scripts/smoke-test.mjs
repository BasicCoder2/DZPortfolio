const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:3105'

const routes = [
  '/',
  '/projects',
  '/projects/lmmu-governance-admissions',
  '/projects/fase-plaza',
  '/projects/uka-smart-home',
  '/projects/loan-tracking',
  '/blog',
  '/blog/building-useful-systems',
  '/robots.txt',
  '/sitemap.xml',
]

let failed = false

for (const route of routes) {
  const url = new URL(route, baseUrl)

  try {
    const response = await fetch(url)
    const result = response.ok ? 'PASS' : 'FAIL'
    console.log(`${result} ${response.status} ${route}`)
    if (!response.ok) failed = true
  } catch (error) {
    failed = true
    const message = error instanceof Error ? error.message : String(error)
    console.error(`FAIL request ${route}: ${message}`)
  }
}

if (failed) {
  console.error(`Smoke test failed for ${baseUrl}`)
  process.exitCode = 1
} else {
  console.log(`Smoke test passed for ${baseUrl}`)
}
