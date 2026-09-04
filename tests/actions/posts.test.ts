import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSupabaseStub, type SupabaseStub } from '@/tests/helpers/supabase-stub'

/**
 * Blog post lifecycle: create, update, publish, unpublish, delete.
 *
 * These exercise the Server Actions directly, which is the interesting layer —
 * a Server Action is a public POST endpoint, reachable without ever rendering
 * the admin layout that guards the UI. So the first thing every test here
 * checks is that unauthorized callers are refused, and the rest check that an
 * authorized one produces the right write *and* the right revalidation.
 */

let stub: SupabaseStub
let authorized = true

const requireAdminForAction = vi.fn(async () =>
  authorized
    ? {
        ok: true as const,
        context: { user: { id: 'u1' }, email: 'owner@example.com', supabase: stub.client },
      }
    : { ok: false as const, message: 'Your session is not authorized. Sign in again to continue.' }
)

const revalidatePosts = vi.fn()
const deleteStoredImage = vi.fn(async () => {})

class RedirectError extends Error {
  constructor(public readonly location: string) {
    super(`NEXT_REDIRECT:${location}`)
  }
}

vi.mock('@/lib/auth/admin', () => ({ requireAdminForAction }))
vi.mock('@/lib/content/cache', () => ({
  revalidatePosts,
  revalidateProjects: vi.fn(),
  revalidateHomeSections: vi.fn(),
}))
vi.mock('@/lib/actions/media', () => ({ deleteStoredImage }))
vi.mock('next/navigation', () => ({
  redirect: (location: string) => {
    throw new RedirectError(location)
  },
}))

const EXISTING_ID = '11111111-1111-4111-8111-111111111111'

function form(values: Record<string, string>): FormData {
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}

const completePost = {
  title: 'Building Useful Systems',
  slug: 'building-useful-systems',
  excerpt: 'A note on turning complex requirements into software people can rely on.',
  content: 'x'.repeat(200),
  status: 'published',
}

beforeEach(() => {
  vi.clearAllMocks()
  authorized = true
  stub = createSupabaseStub({
    posts: [
      {
        id: EXISTING_ID,
        title: 'Existing',
        slug: 'existing',
        excerpt: 'Existing excerpt.',
        content: 'y'.repeat(200),
        cover_image_path: 'posts/2026/01/old.webp',
        cover_image_alt: 'Old cover',
        status: 'draft',
        seo_title: null,
        seo_description: null,
        published_at: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ],
  })
})

async function actions() {
  return import('@/lib/actions/posts')
}

const idle = { status: 'idle' as const, message: '', fieldErrors: {} }

describe('authorization', () => {
  it('refuses every mutation for an unauthorized caller', async () => {
    authorized = false
    const { savePostAction, setPostStatusAction, deletePostAction } = await actions()

    for (const action of [savePostAction, setPostStatusAction, deletePostAction]) {
      const result = await action(idle, form({ ...completePost, id: EXISTING_ID }))
      expect(result.status).toBe('error')
    }

    // Nothing reached the database at all.
    expect(stub.queries).toHaveLength(0)
    expect(revalidatePosts).not.toHaveBeenCalled()
  })
})

describe('create', () => {
  it('inserts a draft and redirects to its editor', async () => {
    const { savePostAction } = await actions()

    await expect(
      savePostAction(idle, form({ ...completePost, slug: 'a-new-post', status: 'draft' }))
    ).rejects.toBeInstanceOf(RedirectError)

    const insert = stub.queries.find((query) => query.operation === 'insert')
    expect(insert?.table).toBe('posts')
    expect(revalidatePosts).toHaveBeenCalledWith('a-new-post')
  })

  it('rejects an incomplete post at publish time and writes nothing', async () => {
    const { savePostAction } = await actions()

    const result = await savePostAction(
      idle,
      form({ title: 'Half done', slug: 'half-done', excerpt: '', content: '', status: 'published' })
    )

    expect(result.status).toBe('error')
    expect(result.fieldErrors).toHaveProperty('content')
    expect(result.fieldErrors).toHaveProperty('excerpt')
    expect(stub.queries).toHaveLength(0)
  })

  it('accepts the same incomplete post as a draft', async () => {
    const { savePostAction } = await actions()

    await expect(
      savePostAction(
        idle,
        form({ title: 'Half done', slug: 'half-done', excerpt: '', content: '', status: 'draft' })
      )
    ).rejects.toBeInstanceOf(RedirectError)
  })

  it('rejects a malformed slug', async () => {
    const { savePostAction } = await actions()

    const result = await savePostAction(idle, form({ ...completePost, slug: 'Not A Slug' }))
    expect(result.fieldErrors).toHaveProperty('slug')
    expect(stub.queries).toHaveLength(0)
  })

  it('reports a duplicate slug against the slug field', async () => {
    const { savePostAction } = await actions()
    // Simulates the unique index firing — the real guarantee, since two saves
    // can race past any application-level check.
    stub.failNext(
      'posts',
      'duplicate key value violates unique constraint "posts_slug_key"',
      '23505'
    )

    const result = await savePostAction(idle, form({ ...completePost, slug: 'existing' }))

    expect(result.status).toBe('error')
    expect(result.fieldErrors.slug?.[0]).toMatch(/already uses that slug/i)
  })
})

describe('update', () => {
  it('saves changes and revalidates the post', async () => {
    const { savePostAction } = await actions()

    const result = await savePostAction(
      idle,
      form({ ...completePost, id: EXISTING_ID, slug: 'existing', previousSlug: 'existing' })
    )

    expect(result.status).toBe('success')
    expect(stub.queries.some((query) => query.operation === 'update')).toBe(true)
    expect(revalidatePosts).toHaveBeenCalledWith('existing')
  })

  it('revalidates the old URL as well when the slug changes', async () => {
    const { savePostAction } = await actions()

    await savePostAction(
      idle,
      form({ ...completePost, id: EXISTING_ID, slug: 'renamed', previousSlug: 'existing' })
    )

    // Without this the old URL keeps serving a page that no longer exists.
    expect(revalidatePosts).toHaveBeenCalledWith('renamed')
    expect(revalidatePosts).toHaveBeenCalledWith('existing')
  })

  it('deletes a replaced image only after the row is saved', async () => {
    const { savePostAction } = await actions()

    await savePostAction(
      idle,
      form({
        ...completePost,
        id: EXISTING_ID,
        slug: 'existing',
        coverImagePath: 'posts/2026/09/new.webp',
        coverImageAlt: 'New cover',
        previousCoverImagePath: 'posts/2026/01/old.webp',
      })
    )

    expect(deleteStoredImage).toHaveBeenCalledWith('posts/2026/01/old.webp')
  })

  it('leaves the image alone when it did not change', async () => {
    const { savePostAction } = await actions()

    await savePostAction(
      idle,
      form({
        ...completePost,
        id: EXISTING_ID,
        slug: 'existing',
        coverImagePath: 'posts/2026/01/old.webp',
        coverImageAlt: 'Old cover',
        previousCoverImagePath: 'posts/2026/01/old.webp',
      })
    )

    expect(deleteStoredImage).not.toHaveBeenCalled()
  })

  it('refuses to attach an image without alt text', async () => {
    const { savePostAction } = await actions()

    const result = await savePostAction(
      idle,
      form({
        ...completePost,
        id: EXISTING_ID,
        coverImagePath: 'posts/2026/09/new.webp',
        coverImageAlt: '',
      })
    )

    expect(result.fieldErrors).toHaveProperty('coverImageAlt')
    expect(stub.queries).toHaveLength(0)
  })
})

describe('publish and unpublish', () => {
  it('publishes from a list row', async () => {
    const { setPostStatusAction } = await actions()

    const result = await setPostStatusAction(idle, form({ id: EXISTING_ID, status: 'published' }))

    expect(result.status).toBe('success')
    expect(result.message).toMatch(/published/i)
    expect(revalidatePosts).toHaveBeenCalled()
  })

  it('unpublishes back to draft', async () => {
    const { setPostStatusAction } = await actions()

    const result = await setPostStatusAction(idle, form({ id: EXISTING_ID, status: 'draft' }))
    expect(result.message).toMatch(/draft/i)
  })

  it('treats any unrecognised status value as draft', async () => {
    // The field is attacker-controllable; only two values may ever be written.
    const { setPostStatusAction } = await actions()

    const result = await setPostStatusAction(idle, form({ id: EXISTING_ID, status: 'archived' }))
    expect(result.message).toMatch(/draft/i)
  })

  it('rejects a malformed id without querying', async () => {
    const { setPostStatusAction } = await actions()

    const result = await setPostStatusAction(idle, form({ id: 'not-a-uuid', status: 'published' }))
    expect(result.status).toBe('error')
    expect(stub.queries).toHaveLength(0)
  })
})

describe('delete', () => {
  it('removes the row, its image, and revalidates', async () => {
    const { deletePostAction } = await actions()

    await expect(deletePostAction(idle, form({ id: EXISTING_ID }))).rejects.toBeInstanceOf(
      RedirectError
    )

    expect(stub.queries.some((query) => query.operation === 'delete')).toBe(true)
    expect(deleteStoredImage).toHaveBeenCalledWith('posts/2026/01/old.webp')
    expect(revalidatePosts).toHaveBeenCalledWith('existing')
  })

  it('refuses a malformed id', async () => {
    const { deletePostAction } = await actions()

    const result = await deletePostAction(idle, form({ id: 'nope' }))
    expect(result.status).toBe('error')
    expect(stub.queries).toHaveLength(0)
  })
})
