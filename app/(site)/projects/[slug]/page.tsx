import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getPublishedProject,
  listPublishedProjectSlugs,
  listPublishedProjects,
} from '@/lib/content/repositories'
import { ProjectCaseStudy } from '@/components/projects/ProjectCaseStudy'
import { constructMetadata } from '@/lib/metadata'

/**
 * Prerendered, revalidated every five minutes.
 *
 * The literal is not an oversight: Next statically analyses route segment
 * config at build time, so `revalidate` must be a literal and an imported
 * constant is rejected outright. Keep these six routes in step by hand — they
 * are listed in docs/CONTENT_PLATFORM.md.
 *
 * The timer is only the fallback. Publishing from the admin area calls
 * revalidatePath on the affected routes immediately (lib/content/cache.ts).
 */
export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await listPublishedProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublishedProject(slug)

  if (!project) {
    return constructMetadata({ title: 'Not found', noIndex: true, path: `/projects/${slug}` })
  }

  return constructMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? (project.summary || undefined),
    path: `/projects/${project.slug}`,
    ...(project.previewImageUrl ? { image: project.previewImageUrl } : {}),
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // One list read serves both the record and its neighbours, in the same order
  // the index uses, so "next project" means the next one a visitor would have
  // seen rather than the next one by id.
  const [project, all] = await Promise.all([
    getPublishedProject(slug),
    listPublishedProjects(),
  ])

  if (!project) notFound()

  const index = all.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? all[index - 1] : undefined
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined

  return <ProjectCaseStudy next={next} previous={previous} project={project} />
}
