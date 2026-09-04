import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug } from '@/lib/content/admin-queries'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { PreviewBanner } from '@/components/admin/PreviewBanner'

export const metadata: Metadata = {
  title: 'Draft preview',
  robots: { index: false, follow: false, nocache: true },
}

/** Draft preview for a project. Same authorization contract as the blog preview. */
export default async function PreviewProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <div className="-mx-6 -my-8 lg:-mx-10 lg:-my-12">
      <PreviewBanner
        backHref={`/admin/projects/${project.id}/edit`}
        status={project.status}
        target={`/projects/${project.slug}`}
      />
      <ProjectCaseStudy preview project={project} />
    </div>
  )
}
