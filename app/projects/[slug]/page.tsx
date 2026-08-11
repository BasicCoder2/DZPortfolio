import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/layout'
import { getProject, projects } from '@/data/projects'
import { constructMetadata } from '@/lib/metadata'

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug as string })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  return constructMetadata({ title: project?.title ?? 'Project', description: project?.description, path: `/projects/${slug}` })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project || !project.caseStudy) notFound()
  const study = project.caseStudy
  return <Section><Container><Link className="text-sm text-text-secondary hover:text-accent-green" href="/projects">← Back to projects</Link><div className="mt-12 max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">{project.category}</p><h1 className="mt-3 text-display-lg">{project.title}</h1><p className="mt-5 text-xl text-text-secondary">{project.description}</p></div><div className="mt-16 grid gap-12 lg:grid-cols-[1fr_0.35fr]"><article className="prose prose-invert max-w-none"><CaseStudyBlock text={study.overview} title="Overview" /><CaseStudyBlock text={study.problem} title="Problem" /><CaseStudyBlock text={study.role} title="Role" /><CaseStudyBlock text={study.solution} title="Solution" /><CaseStudyBlock text={study.architecture} title="Architecture" /><CaseStudyBlock text={study.challenges} title="Challenges" /><CaseStudyBlock text={study.outcome} title="Outcome" /><CaseStudyBlock text={study.reflection} title="Lessons / Reflection" /></article><aside><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">Technologies</p><div className="mt-4 flex flex-wrap gap-2">{project.tags.map((tag) => <span className="rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary" key={tag}>{tag}</span>)}</div></aside></div></Container></Section>
}

function CaseStudyBlock({ title, text }: { title: string; text: string }) { return <section className="mb-10"><h2 className="text-h3">{title}</h2><p className="mt-3 text-text-secondary">{text}</p></section> }
