'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { savePostAction } from '@/lib/actions/posts'
import { firstError, idleFormState } from '@/lib/actions/state'
import type { Post } from '@/lib/content/models'
import {
  FormFeedback,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/ImageField'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { TitleSlugFields } from '@/components/admin/TitleSlugFields'

/**
 * Create / edit form for a blog post.
 *
 * Two submit buttons, both posting the same form with a different `status`.
 * That is what makes "save without publishing" a first-class action rather
 * than a checkbox someone forgets to tick — and it means the stricter
 * publish-time validation in `postSchema` only ever fires when the operator
 * actually asked to publish.
 */
export function PostForm({ post }: { post: Post | null }) {
  const [state, formAction] = useActionState(savePostAction, idleFormState)
  const isNew = post === null
  const isPublished = post?.status === 'published'
  const errors = state.fieldErrors

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {post && <input name="id" type="hidden" value={post.id} />}

      <FormFeedback state={state} />

      <TitleSlugFields
        defaultSlug={post?.slug ?? ''}
        defaultTitle={post?.title ?? ''}
        isNew={isNew}
        slugError={firstError(errors, 'slug')}
        slugPrefix="/blog/"
        titleError={firstError(errors, 'title')}
      />

      <TextAreaField
        defaultValue={post?.excerpt ?? ''}
        error={firstError(errors, 'excerpt')}
        hint="One or two sentences. Shown on the blog index and used as the meta description fallback. Required before publishing."
        label="Excerpt"
        name="excerpt"
        placeholder="A note on turning complex requirements into software people can rely on."
        rows={3}
      />

      <MarkdownEditor
        defaultValue={post?.content ?? ''}
        error={firstError(errors, 'content')}
        hint="Markdown, with GitHub-flavoured tables and lists. Start headings at ## — the page supplies the H1."
        label="Article"
        name="content"
      />

      <ImageField
        altError={firstError(errors, 'coverImageAlt')}
        altName="coverImageAlt"
        defaultAlt={post?.coverImageAlt ?? null}
        defaultPath={post?.coverImagePath ?? null}
        defaultUrl={post?.coverImageUrl ?? null}
        folder="posts"
        label="Cover image"
        pathName="coverImagePath"
      />

      <fieldset className="flex flex-col gap-6 rounded-md border border-border p-5">
        <legend className="px-2 text-sm font-medium text-text-primary">Search appearance</legend>
        <TextField
          defaultValue={post?.seoTitle ?? ''}
          error={firstError(errors, 'seoTitle')}
          hint="Up to 70 characters. Falls back to the post title when empty."
          label="SEO title"
          name="seoTitle"
        />
        <TextAreaField
          defaultValue={post?.seoDescription ?? ''}
          error={firstError(errors, 'seoDescription')}
          hint="Up to 200 characters. Falls back to the excerpt when empty."
          label="SEO description"
          name="seoDescription"
          rows={2}
        />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        {isPublished ? (
          <>
            <SubmitButton name="status" value="published">
              Save changes
            </SubmitButton>
            <SubmitButton name="status" value="draft" variant="secondary">
              Move back to draft
            </SubmitButton>
          </>
        ) : (
          <>
            <SubmitButton name="status" value="draft" variant="secondary">
              Save draft
            </SubmitButton>
            <SubmitButton name="status" value="published">
              Publish
            </SubmitButton>
          </>
        )}

        {post && (
          <Link
            className="ml-auto text-sm text-text-secondary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            href={isPublished ? `/blog/${post.slug}` : `/admin/preview/blog/${post.slug}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {isPublished ? 'View live post' : 'Preview draft'}
          </Link>
        )}
      </div>
    </form>
  )
}
