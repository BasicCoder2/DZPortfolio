import { beforeEach, describe, expect, it, vi } from 'vitest'
import { revalidatePath } from 'next/cache'
import { revalidateHomeSections, revalidatePosts, revalidateProjects } from '@/lib/content/cache'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

beforeEach(() => vi.clearAllMocks())

describe('content mutation refresh', () => {
  it('refreshes visibility and deleted rows in every homepage content manager', () => {
    revalidateHomeSections()
    for (const path of [
      '/',
      '/admin',
      '/admin/experience',
      '/admin/certifications',
      '/admin/engagement',
    ]) {
      expect(revalidatePath).toHaveBeenCalledWith(path)
    }
  })

  it.each([
    ['blog', revalidatePosts],
    ['projects', revalidateProjects],
  ] as const)('refreshes the %s admin list as well as public content', (section, invalidate) => {
    invalidate('example')
    for (const path of ['/admin', `/admin/${section}`, '/', `/${section}`, `/${section}/example`]) {
      expect(revalidatePath).toHaveBeenCalledWith(path)
    }
  })
})
