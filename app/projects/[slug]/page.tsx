import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/layout'
import { getProject, projects } from '@/data/projects'
import { constructMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  return constructMetadata({
    title: project?.title ?? 'Project',
    description: project?.description,
    path: `/projects/${slug}`,
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project?.caseStudy) notFound()

  const study = project.caseStudy
  const currentIndex = projects.findIndex((item) => item.slug === slug)
  const previous = currentIndex > 0 ? projects[currentIndex - 1] : undefined
  const next =
    currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined

  return (
    <Section>
      <Container>
        <Link className="text-sm text-text-secondary hover:text-accent-green" href="/projects">
          ← Back to projects
        </Link>
        <header className="mt-12 max-w-4xl border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            <span>{project.category}</span>
            <span className="text-text-tertiary">{project.date}</span>
            <span className="text-text-tertiary">{project.status}</span>
          </div>
          <h1 className="mt-4 text-display-lg">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-text-secondary">
            {project.description}
          </p>
        </header>
        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-20">
          <article className="max-w-3xl">
            <CaseStudyBlock text={study.overview} title="Overview" />
            <CaseStudyBlock text={study.problem} title="Problem" />
            <CaseStudyBlock text={study.role} title="Role" />
            <CaseStudyBlock text={study.solution} title="Solution" />
            <CaseStudyBlock text={study.architecture} title="Architecture" />
            <section className="mb-12 border-l-2 border-accent-green/50 pl-5">
              <h2 className="text-h3">Technical decisions</h2>
              <ul className="mt-4 space-y-2 text-text-secondary">
                {study.decisions.map((decision) => (
                  <li key={decision}>— {decision}</li>
                ))}
              </ul>
            </section>
            <CaseStudyBlock text={study.challenges} title="Challenges" />
            <CaseStudyBlock text={study.outcome} title="Outcome" />
            <CaseStudyBlock text={study.reflection} title="Lessons / Reflection" />
          </article>
          <aside className="self-start lg:sticky lg:top-28">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              Technologies
            </p>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              {project.tags.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
            </div>
          </aside>
        </div>
        <nav
          aria-label="Project navigation"
          className="mt-16 grid gap-6 border-t border-border pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link className="group" href={previous.href}>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
                Previous project
              </span>
              <span className="mt-2 block text-lg font-semibold group-hover:text-accent-green">
                {previous.shortTitle ?? previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link className="text-left sm:text-right" href={next.href}>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
                Next project
              </span>
              <span className="mt-2 block text-lg font-semibold hover:text-accent-green">
                {next.shortTitle ?? next.title}
              </span>
            </Link>
          )}
        </nav>
      </Container>
    </Section>
  )
}

function CaseStudyBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="mb-12">
      <h2 className="text-h3">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-text-secondary">{text}</p>
    </section>
  )
}
