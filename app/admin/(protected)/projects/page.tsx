import Link from 'next/link'
import { listAllProjects } from '@/lib/content/admin-queries'
import { deleteProjectAction, setProjectStatusAction } from '@/lib/actions/projects'
import {
  AdminEmptyState,
  AdminList,
  AdminListRow,
  AdminPageHeader,
  AdminPrimaryLink,
  MetaLine,
  StatusPill,
  formatTimestamp,
} from '@/components/admin/primitives'
import { ContentRowActions } from '@/components/admin/ContentRowActions'

/**
 * Projects list.
 *
 * Sorted by display order, matching the public page, so reordering can be
 * reasoned about here rather than by loading the site to check.
 */
export default async function AdminProjectsPage() {
  const projects = await listAllProjects()

  return (
    <>
      <AdminPageHeader
        actions={<AdminPrimaryLink href="/admin/projects/new">New project</AdminPrimaryLink>}
        description="Case studies published at /projects. Featured projects also appear on the homepage."
        eyebrow="Content"
        title="Projects"
      />

      {projects.length === 0 ? (
        <AdminEmptyState
          action={
            <AdminPrimaryLink href="/admin/projects/new">Add the first project</AdminPrimaryLink>
          }
          description="No projects have been added yet. The public projects page shows its empty state until one is published."
          title="No projects yet"
        />
      ) : (
        <AdminList>
          {projects.map((project) => (
            <AdminListRow key={project.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    className="text-lg font-semibold text-text-primary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                    href={`/admin/projects/${project.id}/edit`}
                  >
                    {project.title}
                  </Link>
                  <StatusPill status={project.status} />
                  {project.featured && (
                    <span className="rounded-full border border-accent-green/40 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-green">
                      Featured
                    </span>
                  )}
                </div>

                {project.summary !== '' && (
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">{project.summary}</p>
                )}

                <MetaLine>
                  <span>/projects/{project.slug}</span>
                  {project.category !== '' && <span>{project.category}</span>}
                  <span>Order {project.displayOrder}</span>
                  <span>Updated {formatTimestamp(project.updatedAt)}</span>
                </MetaLine>
              </div>

              <ContentRowActions
                deleteAction={deleteProjectAction}
                draftValue="draft"
                field="status"
                id={project.id}
                isLive={project.status === 'published'}
                liveValue="published"
                name={project.title}
                publishLabel="Publish"
                statusAction={setProjectStatusAction}
                unpublishLabel="Unpublish"
              />
            </AdminListRow>
          ))}
        </AdminList>
      )}
    </>
  )
}
