import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/lib/content/models'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

/**
 * Project card for the projects index.
 *
 * Now reads the database-backed model. Two behavioural changes came with that:
 *
 * - **Alt text is the operator's, not generated.** It used to be
 *   `${title} project preview`, which describes the file rather than the
 *   picture. The admin form now requires a real description whenever an image
 *   is attached, and that is what is used.
 * - **A missing image is missing.** The old fallback pointed every
 *   image-less project at the LMMU artwork, so a card could advertise the
 *   wrong system entirely. A neutral panel is the honest version.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <MotionWrapper variant="fadeUp">
      <article className="group overflow-hidden border-y border-border bg-surface">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          {project.previewImageUrl ? (
            <Image
              fill
              alt={project.previewImageAlt ?? ''}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 767px) 100vw, 50vw"
              src={project.previewImageUrl}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,var(--color-accent-green-glow),transparent_60%)]"
            >
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
                {project.category || 'Project'}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-7">
          {project.category !== '' && (
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              {project.category}
            </p>
          )}
          <h2 className="mt-3 text-h3">{project.title}</h2>
          {project.summary !== '' && (
            <p className="mt-3 text-text-secondary">{project.summary}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-tertiary">
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
          <Link
            className="mt-6 inline-flex items-center gap-2 font-medium transition-colors hover:text-accent-green"
            href={project.href}
          >
            View case study{' '}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </article>
    </MotionWrapper>
  )
}
