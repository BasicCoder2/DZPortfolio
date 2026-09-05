import { beforeEach, expect, it, vi } from 'vitest'
import { idleFormState } from '@/lib/actions/state'
import { MAX_CV_BYTES, validateCv } from '@/lib/media/cv'

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  upsert: vi.fn(),
  refresh: vi.fn(),
}))
vi.mock('@/lib/auth/admin', () => ({ requireAdminForAction: mocks.auth }))
vi.mock('next/cache', () => ({ revalidatePath: mocks.refresh }))
import { updateCvAction } from '@/lib/actions/cv'

beforeEach(() => {
  vi.clearAllMocks()
  mocks.auth.mockResolvedValue({
    ok: true,
    context: {
      supabase: {
        storage: { from: () => ({ upload: mocks.upload, remove: mocks.remove }) },
        from: () => ({ upsert: mocks.upsert }),
      },
    },
  })
  mocks.upload.mockResolvedValue({ error: null })
  mocks.upsert.mockResolvedValue({ error: null })
  mocks.remove.mockResolvedValue({ error: null })
})

function pdf() {
  const form = new FormData()
  form.set('file', new File(['%PDF-1.7\nexample'], 'cv.pdf', { type: 'application/pdf' }))
  return form
}

it('refuses unauthorized uploads before accessing storage', async () => {
  mocks.auth.mockResolvedValue({ ok: false, message: 'Unauthorized' })
  expect((await updateCvAction(idleFormState, pdf())).status).toBe('error')
  expect(mocks.upload).not.toHaveBeenCalled()
})

it('validates empty, oversized, and disguised PDFs', () => {
  const header = new TextEncoder().encode('%PDF-')
  expect(validateCv(0, header)).toBeTruthy()
  expect(validateCv(MAX_CV_BYTES + 1, header)).toBeTruthy()
  expect(validateCv(100, new TextEncoder().encode('<html'))).toBeTruthy()
  expect(validateCv(MAX_CV_BYTES, header)).toBeNull()
})

it('switches the current CV only after a successful upload', async () => {
  expect((await updateCvAction(idleFormState, pdf())).status).toBe('success')
  const path = mocks.upload.mock.calls[0][0]
  expect(mocks.upsert).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'current', path, filename: 'cv.pdf' })
  )
  expect(mocks.refresh).toHaveBeenCalledWith('/admin/cv')
})

it('keeps the current CV when storage fails', async () => {
  mocks.upload.mockResolvedValue({ error: { message: 'Failed' } })
  expect((await updateCvAction(idleFormState, pdf())).status).toBe('error')
  expect(mocks.upsert).not.toHaveBeenCalled()
})

it('cleans up an uploaded file if switching the current CV fails', async () => {
  mocks.upsert.mockResolvedValue({ error: { message: 'Failed' } })
  expect((await updateCvAction(idleFormState, pdf())).status).toBe('error')
  expect(mocks.remove).toHaveBeenCalledWith([mocks.upload.mock.calls[0][0]])
  expect(mocks.refresh).not.toHaveBeenCalled()
})
