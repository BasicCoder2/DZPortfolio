import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/types'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

export function ProjectCard({ project }: { project: Project }) {
  return <MotionWrapper variant="fadeUp"><article className="group overflow-hidden rounded-xl border border-border bg-surface"><div className="relative aspect-[16/9] overflow-hidden border-b border-border"><Image fill alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 767px) 100vw, 50vw" src={project.coverImage ?? '/images/projects/lmmu-governance-admissions.svg'} /></div><div className="p-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{project.category}</p><h2 className="mt-3 text-h3">{project.title}</h2><p className="mt-3 text-text-secondary">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span className="rounded-full border border-border px-3 py-1 text-xs text-text-tertiary" key={tag}>{tag}</span>)}</div><Link className="mt-6 inline-flex items-center gap-2 font-medium transition-colors hover:text-accent-green" href={project.href}>View case study <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></div></article></MotionWrapper>
}
