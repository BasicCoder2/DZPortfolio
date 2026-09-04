import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/content/admin-queries'
import {
  AdminPageHeader,
  AdminSecondaryLink,
  StatusPill,
  formatTimestamp,
} from '@/components/admin/primitives'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)

  if (!project) notFound()

  return (
    <>
      <AdminPageHeader
        actions={<AdminSecondaryLink href="/admin/projects">Back to projects</AdminSecondaryLink>}
        description={`Last updated ${formatTimestamp(project.updatedAt)}.`}
        eyebrow="Projects"
        title={project.title}
      />

      <div className="mb-8 flex items-center gap-3">
        <StatusPill status={project.status} />
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
          /projects/{project.slug}
        </span>
      </div>

      <ProjectForm project={project} />
    </>
  )
}
