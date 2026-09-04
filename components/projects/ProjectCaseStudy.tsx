import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/layout'
import { Markdown } from '@/lib/content/markdown'
import type { Project } from '@/lib/content/models'

/**
 * The rendered body of a project case study.
 *
 * Keeps the layout the static version established — a wide prose column with a
 * sticky technologies rail, and previous/next navigation across the set — but
 * the body is now one Markdown document rather than nine fixed fields.
 *
 * That change is deliberate. The fixed shape (Overview / Problem / Role /
 * Solution / Architecture / Decisions / Challenges / Outcome / Reflection) had
 * every project rendering nine identical headings whether or not there was
 * anything to say under them, which is how all four ended up reading
 * "Detailed case-study documentation is being prepared." A Markdown body lets
 * a short project be short. The suggested headings live in the editor hint.
 *
 * Shared with the admin draft preview, for the same reason as `PostArticle`.
 */
export function ProjectCaseStudy({
  project,
  previous,
  next,
  preview,
}: {
  project: Project
  previous?: Project
  next?: Project
  preview?: boolean
}) {
  const links = [
    project.externalUrl ? { href: project.externalUrl, label: 'Visit live site' } : null,
    project.repositoryUrl ? { href: project.repositoryUrl, label: 'View repository' } : null,
  ].filter((link): link is { href: string; label: string } => link !== null)

  return (
    <Section>
      <Container>
        {!preview && (
          <Link className="text-sm text-text-secondary hover:text-accent-green" href="/projects">
            ← Back to projects
          </Link>
        )}

        <header className="mt-12 max-w-4xl border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            {project.category !== '' && <span>{project.category}</span>}
            {project.publishedAt && (
              <span className="text-text-tertiary">
                {new Date(project.publishedAt).getFullYear()}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-display-lg">{project.title}</h1>
          {project.summary !== '' && (
            <p className="mt-5 max-w-2xl text-xl leading-8 text-text-secondary">
              {project.summary}
            </p>
          )}
        </header>

        {project.previewImageUrl && (
          <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-md border border-border">
            <Image
              fill
              priority
              alt={project.previewImageAlt ?? ''}
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 1200px"
              src={project.previewImageUrl}
            />
          </figure>
        )}

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-20">
          <article className="max-w-3xl">
            {project.content.trim() === '' ? (
              <p className="text-lg leading-8 text-text-secondary">
                Detailed case-study documentation is being prepared.
              </p>
            ) : (
              <Markdown headingOffset={1}>{project.content}</Markdown>
            )}
          </article>

          <aside className="self-start lg:sticky lg:top-28">
            {project.technologies.length > 0 && (
              <>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                  Technologies
                </p>
                <div className="mt-4 space-y-2 text-sm text-text-secondary">
                  {project.technologies.map((technology) => (
                    <p key={technology}>{technology}</p>
                  ))}
                </div>
              </>
            )}

            {links.length > 0 && (
              <div className="mt-10 space-y-3">
                {links.map((link) => (
                  <a
                    className="inline-flex items-center gap-2 border-b border-border-strong pb-1 text-sm font-medium hover:border-accent-green hover:text-accent-green"
                    href={link.href}
                    key={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {link.label} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </aside>
        </div>

        {!preview && (previous || next) && (
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
                  {previous.title}
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
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </Container>
    </Section>
  )
}
