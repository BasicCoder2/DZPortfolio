import type { Metadata } from 'next'
import { Container, Section } from '@/components/layout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { listPublishedProjects } from '@/lib/content/repositories'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: 'Projects',
  description: 'Selected software systems and digital products by Daniel Zimba.',
  path: '/projects',
})

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

export default async function ProjectsPage() {
  const projects = await listPublishedProjects()

  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            Selected work
          </p>
          <h1 className="mt-3 text-display-lg">Projects</h1>
          <p className="mt-5 text-lg text-text-secondary">
            A record of systems, products, and experiments.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="mt-16 border-y border-border py-12 text-lg text-text-secondary">
            Project write-ups are being prepared.
          </p>
        ) : (
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
