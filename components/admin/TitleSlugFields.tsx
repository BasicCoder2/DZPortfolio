'use client'

import { useState } from 'react'
import { slugifyContent } from '@/lib/content/slug'
import { TextField } from '@/components/admin/form-controls'

/**
 * Paired title and slug inputs.
 *
 * The slug follows the title until the operator edits it, and then it stops —
 * permanently, for that editing session. That one rule is the whole design:
 * auto-generation is a convenience for new records, but silently rewriting a
 * slug someone deliberately chose would change a published URL out from under
 * them.
 *
 * For an existing record the link starts off, because the slug is already load
 * bearing. "Generate from title" is always available to opt back in
 * explicitly.
 */
export function TitleSlugFields({
  defaultTitle,
  defaultSlug,
  titleError,
  slugError,
  isNew,
  slugPrefix,
}: {
  defaultTitle: string
  defaultSlug: string
  titleError?: string
  slugError?: string
  isNew: boolean
  /** Shown before the slug so the resulting URL is visible, e.g. "/blog/". */
  slugPrefix: string
}) {
  const [title, setTitle] = useState(defaultTitle)
  const [slug, setSlug] = useState(defaultSlug)
  const [linked, setLinked] = useState(isNew)

  function handleTitle(value: string) {
    setTitle(value)
    if (linked) setSlug(slugifyContent(value))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TextField
        required
        error={titleError}
        label="Title"
        name="title"
        placeholder="Building useful systems"
        value={title}
        onChange={handleTitle}
      />

      <div className="flex flex-col gap-2">
        <TextField
          required
          error={slugError}
          hint={`${slugPrefix}${slug || 'your-slug'}`}
          label="Slug"
          name="slug"
          placeholder="building-useful-systems"
          value={slug}
          onChange={(value) => {
            setSlug(value)
            setLinked(false)
          }}
        />
        <button
          className="self-start text-xs text-text-tertiary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          type="button"
          onClick={() => {
            setSlug(slugifyContent(title))
            setLinked(true)
          }}
        >
          {linked ? 'Following the title' : 'Generate from title'}
        </button>
      </div>

      {/* Lets the server revalidate the old URL when a slug changes. */}
      <input name="previousSlug" type="hidden" value={defaultSlug} />
    </div>
  )
}
