import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ read: vi.fn(), url: vi.fn() }))
vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: mocks.read }) }) }),
    storage: { from: () => ({ getPublicUrl: mocks.url }) },
  }),
}))
import { GET } from '@/app/cv/route'

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NEXT_PUBLIC_RESUME_URL', '')
})

it('resolves the latest hosted PDF without caching the redirect', async () => {
  mocks.read.mockResolvedValue({ data: { path: 'new.pdf' }, error: null })
  mocks.url.mockReturnValue({
    data: { publicUrl: 'https://example.supabase.co/new.pdf?download=cv.pdf' },
  })
  const response = await GET(new Request('https://portfolio.test/cv'))
  expect(response.status).toBe(307)
  expect(response.headers.get('Location')).toContain('new.pdf')
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(mocks.url).toHaveBeenCalledWith('new.pdf', { download: 'daniel-zimba-cv.pdf' })
})

it('uses the bundled CV before the first upload', async () => {
  mocks.read.mockResolvedValue({ data: null, error: null })
  const response = await GET(new Request('https://portfolio.test/cv'))
  expect(response.headers.get('Location')).toBe(
    'https://portfolio.test/assets/cv/daniel-zimba-cv.pdf'
  )
})

it('reports database failures instead of serving an outdated CV', async () => {
  mocks.read.mockResolvedValue({ data: null, error: { message: 'Offline' } })
  expect((await GET(new Request('https://portfolio.test/cv'))).status).toBe(503)
})
