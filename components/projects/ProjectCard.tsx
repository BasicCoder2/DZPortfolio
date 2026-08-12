import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <MotionWrapper variant="fadeUp">
      <article className="group overflow-hidden border-y border-border bg-surface">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border">
          <Image
            fill
            alt={`${project.title} project preview`}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 767px) 100vw, 50vw"
            src={project.coverImage ?? '/images/projects/lmmu-governance-admissions.svg'}
          />
        </div>
        <div className="p-6 md:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            {project.category}
          </p>
          <h2 className="mt-3 text-h3">{project.title}</h2>
          <p className="mt-3 text-text-secondary">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-tertiary">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
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
