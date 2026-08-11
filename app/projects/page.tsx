import type { Metadata } from 'next'
import { Container, Section } from '@/components/layout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { projects } from '@/data/projects'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({ title: 'Projects', description: 'Selected software systems and digital products by Daniel Zimba.', path: '/projects' })

export default function ProjectsPage() {
  return <Section><Container><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">Selected work</p><h1 className="mt-3 text-display-lg">Projects</h1><p className="mt-5 text-lg text-text-secondary">A record of systems, products, and experiments. Detailed case-study content is being prepared where documentation is incomplete.</p></div><div className="mt-16 grid gap-6 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></Container></Section>
}
