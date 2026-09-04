'use client'

import { useId, useRef, useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { uploadImageAction, type UploadState } from '@/lib/actions/media'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/media/images'
import { TextField } from '@/components/admin/form-controls'

/**
 * Upload, replace and remove a single content image.
 *
 * The upload runs on its own, outside the surrounding record form, via a
 * direct Server Action call in a transition — HTML forbids nesting a `<form>`
 * inside a `<form>`, and the alternative (uploading the bytes as part of the
 * record submission) would mean re-uploading the image every time validation
 * bounced the form back.
 *
 * The result is written into a hidden input. Storage and the database are
 * therefore updated in two steps, which is the right order: an abandoned form
 * leaves an unreferenced object in the bucket rather than a record pointing at
 * a file that was never saved.
 *
 * Alt text sits inside this component rather than off in the SEO section
 * because the moment to describe a picture is while you are looking at it.
 */

const idleUpload: UploadState = { status: 'idle', message: '', fieldErrors: {} }

export function ImageField({
  folder,
  pathName,
  altName,
  label,
  defaultPath,
  defaultUrl,
  defaultAlt,
  altError,
  hint,
}: {
  folder: 'posts' | 'projects' | 'certifications'
  pathName: string
  altName: string
  label: string
  defaultPath: string | null
  defaultUrl: string | null
  defaultAlt: string | null
  altError?: string
  hint?: string
}) {
  const inputId = useId()
  const statusId = `${inputId}-status`
  const fileInput = useRef<HTMLInputElement>(null)

  const [path, setPath] = useState(defaultPath ?? '')
  const [url, setUrl] = useState(defaultUrl ?? '')
  const [message, setMessage] = useState('')
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  function upload(file: File) {
    const formData = new FormData()
    formData.set('folder', folder)
    formData.set('file', file)

    startTransition(async () => {
      const result = await uploadImageAction(idleUpload, formData)
      if (result.status === 'success' && result.path) {
        setPath(result.path)
        setUrl(result.url ?? '')
        setFailed(false)
        setMessage('Image uploaded. It is attached when you save this record.')
      } else {
        setFailed(true)
        setMessage(result.message || 'That image could not be uploaded.')
      }
      if (fileInput.current) fileInput.current.value = ''
    })
  }

  function clear() {
    setPath('')
    setUrl('')
    setFailed(false)
    // The stored object is not deleted here. Saving the record with an empty
    // path is what triggers cleanup on the server, so a cancelled edit leaves
    // the live image intact.
    setMessage('Image removed. Save the record to apply the change.')
  }

  const limitMb = Math.round(MAX_IMAGE_BYTES / (1024 * 1024))

  return (
    <fieldset className="flex flex-col gap-4 rounded-md border border-border p-5">
      <legend className="px-2 text-sm font-medium text-text-primary">{label}</legend>

      {/* What actually gets submitted with the record. */}
      <input name={pathName} type="hidden" value={path} />
      <input
        name={`previous${pathName.charAt(0).toUpperCase()}${pathName.slice(1)}`}
        type="hidden"
        value={defaultPath ?? ''}
      />

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-surface">
          {url === '' ? (
            <span className="px-3 text-center text-xs text-text-tertiary">No image</span>
          ) : (
            // A 160px admin thumbnail of a just-uploaded file, behind
            // authentication and never served to visitors. Routing it through
            // the optimizer would add a transform per upload for no
            // user-facing benefit.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-full w-full object-cover" src={url} />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <input
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            aria-describedby={statusId}
            className={cn(
              'block w-full text-sm text-text-secondary',
              'file:mr-4 file:rounded-md file:border file:border-border-strong file:bg-transparent',
              'file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text-primary',
              'hover:file:border-accent-green hover:file:text-accent-green',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
            )}
            disabled={pending}
            id={inputId}
            ref={fileInput}
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) upload(file)
            }}
          />

          <p className="text-xs text-text-tertiary">
            JPEG, PNG, WebP, AVIF or GIF, up to {limitMb} MB.
            {hint ? ` ${hint}` : ''}
          </p>

          <div aria-atomic="true" aria-live="polite" className="min-h-0" id={statusId}>
            {pending && <p className="text-xs text-text-tertiary">Uploading…</p>}
            {!pending && message !== '' && (
              <p
                className={cn('text-xs', failed ? 'text-[var(--danger)]' : 'text-accent-green')}
                role={failed ? 'alert' : 'status'}
              >
                {message}
              </p>
            )}
          </div>

          {path !== '' && (
            <button
              className="self-start text-xs text-text-tertiary underline-offset-4 hover:text-[var(--danger)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              type="button"
              onClick={clear}
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {path !== '' && (
        <TextField
          required
          defaultValue={defaultAlt ?? ''}
          error={altError}
          hint="Describe what the image shows, for readers who cannot see it."
          label="Alt text"
          name={altName}
          placeholder="Dashboard showing the admissions ranking table"
        />
      )}
    </fieldset>
  )
}
