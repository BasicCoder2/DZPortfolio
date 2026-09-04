import { requireAdmin } from '@/lib/auth/admin'
import { AdminPageHeader, AdminSecondaryLink } from '@/components/admin/primitives'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default async function NewProjectPage() {
  await requireAdmin('/admin/projects/new')

  return (
    <>
      <AdminPageHeader
        actions={<AdminSecondaryLink href="/admin/projects">Back to projects</AdminSecondaryLink>}
        description="Saved as a draft until you publish it. Nothing here is visible to visitors."
        eyebrow="Projects"
        title="New project"
      />
      <ProjectForm project={null} />
    </>
  )
}
