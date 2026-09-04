'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from '@/lib/content/markdown'

/**
 * Markdown editor: a plain textarea and a live preview, switched by tabs.
 *
 * A textarea rather than a rich-text editor, deliberately. The stored value is
 * Markdown; a WYSIWYG surface would have to round-trip through it, and every
 * such round trip is a chance to mangle content that was fine. This is also
 * the reason the preview is worth having — it is the only place the author
 * sees what the syntax actually produces.
 *
 * The preview renders through the same `<Markdown>` component the public page
 * uses, so what is shown here is what will ship, including its safety
 * behaviour: pasted `<script>` shows up as literal text in both places.
 *
 * Both panels stay mounted. Unmounting the textarea to show the preview would
 * lose the caret position and the browser's undo history.
 */
export function MarkdownEditor({
  name,
  label,
  defaultValue,
  hint,
  error,
  rows = 20,
}: {
  name: string
  label: string
  defaultValue: string
  hint?: string
  error?: string
  rows?: number
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const panelId = `${id}-preview`

  const [value, setValue] = useState(defaultValue)
  const [mode, setMode] = useState<'write' | 'preview'>('write')

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium text-text-primary" htmlFor={id}>
          {label}
        </label>

        <div className="flex items-center gap-1" role="tablist">
          {(['write', 'preview'] as const).map((tab) => (
            <button
              aria-controls={tab === 'preview' ? panelId : id}
              aria-selected={mode === tab}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
                mode === tab
                  ? 'bg-surface text-accent-green'
                  : 'text-text-tertiary hover:text-text-primary'
              )}
              key={tab}
              role="tab"
              type="button"
              onClick={() => setMode(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <textarea
        spellCheck
        aria-describedby={describedBy === '' ? undefined : describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full rounded-md border bg-[var(--background)] px-3 py-3 font-mono text-sm leading-6 text-text-primary',
          'outline-none transition-[border-color,box-shadow] resize-y',
          'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
          error ? 'border-[var(--danger)]' : 'border-border',
          mode === 'preview' && 'hidden'
        )}
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <div
        className={cn(
          'min-h-[12rem] rounded-md border border-border bg-[var(--background)] px-5 py-4',
          mode === 'write' && 'hidden'
        )}
        id={panelId}
        role="tabpanel"
      >
        {value.trim() === '' ? (
          <p className="text-sm text-text-tertiary">Nothing to preview yet.</p>
        ) : (
          // headingOffset 1 mirrors the article page, where the page owns the
          // <h1> and the body starts at <h2>.
          <Markdown headingOffset={1}>{value}</Markdown>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {hint && (
          <p className="text-xs text-text-tertiary" id={hintId}>
            {hint}
          </p>
        )}
        <p className="ml-auto font-mono text-xs text-text-tertiary">
          {value.length.toLocaleString('en-GB')} characters
        </p>
      </div>

      {error && (
        <p className="text-xs text-[var(--danger)]" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
