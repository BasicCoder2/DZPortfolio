'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { saveProjectAction } from '@/lib/actions/projects'
import { firstError, idleFormState } from '@/lib/actions/state'
import type { Project } from '@/lib/content/models'
import {
  CheckboxField,
  FormFeedback,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/admin/form-controls'
import { ImageField } from '@/components/admin/ImageField'
import { MarkdownEditor } from '@/components/admin/MarkdownEditor'
import { TitleSlugFields } from '@/components/admin/TitleSlugFields'

/** Create / edit form for a project case study. Mirrors PostForm's two-button save. */
export function ProjectForm({ project }: { project: Project | null }) {
  const [state, formAction] = useActionState(saveProjectAction, idleFormState)
  const isNew = project === null
  const isPublished = project?.status === 'published'
  const errors = state.fieldErrors

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {project && <input name="id" type="hidden" value={project.id} />}

      <FormFeedback state={state} />

      <TitleSlugFields
        defaultSlug={project?.slug ?? ''}
        defaultTitle={project?.title ?? ''}
        isNew={isNew}
        slugError={firstError(errors, 'slug')}
        slugPrefix="/projects/"
        titleError={firstError(errors, 'title')}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={project?.category ?? ''}
          error={firstError(errors, 'category')}
          hint="The label above the title, e.g. Enterprise System."
          label="Category"
          name="category"
        />
        <TextField
          defaultValue={String(project?.displayOrder ?? 0)}
          error={firstError(errors, 'displayOrder')}
          hint="Lower numbers appear first on the projects page."
          inputMode="numeric"
          label="Display order"
          min="0"
          name="displayOrder"
          type="number"
        />
      </div>

      <TextAreaField
        defaultValue={project?.summary ?? ''}
        error={firstError(errors, 'summary')}
        hint="One or two sentences for the project card. Required before publishing."
        label="Summary"
        name="summary"
        rows={3}
      />

      <TextAreaField
        defaultValue={project?.technologies.join(', ') ?? ''}
        error={firstError(errors, 'technologies')}
        hint="Comma separated. Shown in the sidebar of the case study."
        label="Technologies"
        name="technologies"
        placeholder="Laravel, React, Inertia.js, Tailwind, MySQL"
        rows={2}
      />

      <MarkdownEditor
        defaultValue={project?.content ?? ''}
        error={firstError(errors, 'content')}
        hint="The case study. Use ## headings for Overview, Problem, Role, Solution, Architecture, Outcome and so on."
        label="Case study"
        name="content"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={project?.externalUrl ?? ''}
          error={firstError(errors, 'externalUrl')}
          hint="Optional. Full URL including https://."
          label="Live URL"
          name="externalUrl"
          type="url"
        />
        <TextField
          defaultValue={project?.repositoryUrl ?? ''}
          error={firstError(errors, 'repositoryUrl')}
          hint="Optional. Full URL including https://."
          label="Repository URL"
          name="repositoryUrl"
          type="url"
        />
      </div>

      <ImageField
        altError={firstError(errors, 'previewImageAlt')}
        altName="previewImageAlt"
        defaultAlt={project?.previewImageAlt ?? null}
        defaultPath={project?.previewImagePath ?? null}
        defaultUrl={project?.previewImageUrl ?? null}
        folder="projects"
        label="Preview image"
        pathName="previewImagePath"
      />

      <CheckboxField
        defaultChecked={project?.featured ?? false}
        hint="Featured projects appear in the grid on the homepage."
        label="Feature on the homepage"
        name="featured"
      />

      <fieldset className="flex flex-col gap-6 rounded-md border border-border p-5">
        <legend className="px-2 text-sm font-medium text-text-primary">Search appearance</legend>
        <TextField
          defaultValue={project?.seoTitle ?? ''}
          error={firstError(errors, 'seoTitle')}
          hint="Up to 70 characters. Falls back to the project title when empty."
          label="SEO title"
          name="seoTitle"
        />
        <TextAreaField
          defaultValue={project?.seoDescription ?? ''}
          error={firstError(errors, 'seoDescription')}
          hint="Up to 200 characters. Falls back to the summary when empty."
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

        {project && (
          <Link
            className="ml-auto text-sm text-text-secondary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            href={
              isPublished ? `/projects/${project.slug}` : `/admin/preview/projects/${project.slug}`
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            {isPublished ? 'View live project' : 'Preview draft'}
          </Link>
        )}
      </div>
    </form>
  )
}
