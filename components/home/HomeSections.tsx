import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Building2, Globe2, Layers3, Smartphone, Sparkles } from 'lucide-react'
import { Container, Section } from '@/components/layout'
import { MotionWrapper } from '@/components/animations/MotionWrapper'
import { Terminal, TechnologyRing, CommitGraph } from '@/components/motifs'
import { ContactForm } from '@/components/contact'
import { services } from '@/data/services'
import { projects } from '@/data/projects'
import { pricingOptions } from '@/data/pricing'
import { experience } from '@/data/experience'
import { certifications } from '@/data/certifications'
import { technologies } from '@/data/technologies'
import { blogPosts } from '@/data/blog'
import { SOCIAL_LINKS } from '@/lib/constants'

const icons = { Building2, Globe2, Layers3, Smartphone, Sparkles }

function SectionIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <MotionWrapper className="mb-12 max-w-2xl" variant="fadeUp"><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-green">{eyebrow}</p><h2 className="text-h2">{title}</h2>{children && <p className="mt-4 text-lg text-text-secondary">{children}</p>}</MotionWrapper>
}

export function AboutSection() {
  return <Section data-nav-section id="about"><Container><div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center"><div><SectionIntro eyebrow="01 / About" title="About">I’m Daniel Zimba, a Software Developer focused on building practical digital systems that solve real-world problems.</SectionIntro><div className="space-y-4 text-text-secondary"><p>My work spans enterprise applications, web platforms, mobile development, AI-powered systems, and IoT.</p><p>I enjoy turning complex requirements into software that is usable, maintainable, and reliable.</p></div></div><MotionWrapper className="lg:justify-self-end" variant="fadeRight"><Terminal /></MotionWrapper></div></Container></Section>
}

export function ServicesSection() {
  return <Section data-nav-section id="services"><Container><SectionIntro eyebrow="02 / Capabilities" title="What I Build">Software systems designed around the people, workflows, and decisions they need to support.</SectionIntro><div className="grid gap-5 md:grid-cols-2">{services.map((service) => { const Icon = icons[service.icon as keyof typeof icons] ?? Layers3; return <MotionWrapper key={service.id} variant="fadeUp"><article className="h-full rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent-green/40"><Icon aria-hidden="true" className="mb-6 h-6 w-6 text-accent-green" /><h3 className="text-h3">{service.title}</h3><p className="mt-3 text-text-secondary">{service.description}</p><ul className="mt-5 space-y-2 text-sm text-text-tertiary">{service.highlights.map((highlight) => <li key={highlight}>— {highlight}</li>)}</ul></article></MotionWrapper> })}</div><div className="mt-16 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center"><div><h3 className="text-h3">Technology with a point of view.</h3><p className="mt-4 max-w-lg text-text-secondary">The tools matter, but the system they help people use matters more.</p></div><TechnologyRing /></div></Container></Section>
}

export function PricingSection() {
  return <Section><Container><SectionIntro eyebrow="Engagement" title="A useful way to start">Choose the level of clarity or delivery that matches where the work is today.</SectionIntro><div className="grid gap-5 lg:grid-cols-3">{pricingOptions.map((option) => <MotionWrapper key={option.id} variant="fadeUp"><article className={`relative h-full rounded-xl border p-6 ${option.recommended ? 'border-accent-green bg-surface-elevated' : 'border-border bg-surface'}`}>{option.recommended && <span className="absolute right-5 top-5 rounded-full bg-accent-green px-3 py-1 text-xs font-medium text-[#07111f]">Recommended</span>}<h3 className="text-h3">{option.title}</h3><p className="mt-4 text-2xl font-semibold text-text-primary">{option.price}</p><p className="mt-4 text-text-secondary">{option.description}</p><ul className="mt-6 space-y-2 text-sm text-text-tertiary">{option.items.map((item) => <li key={item}>— {item}</li>)}</ul></article></MotionWrapper>)}</div></Container></Section>
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return <MotionWrapper variant="fadeUp"><article className="group overflow-hidden rounded-xl border border-border bg-surface"><div className="relative aspect-[16/9] overflow-hidden border-b border-border"><Image fill alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 767px) 100vw, 50vw" src={project.coverImage ?? '/images/projects/lmmu-governance-admissions.svg'} /></div><div className="p-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{project.category}</p><h3 className="mt-3 text-h3">{project.title}</h3><p className="mt-3 text-text-secondary">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.slice(0, 5).map((tag) => <span className="rounded-full border border-border px-3 py-1 text-xs text-text-tertiary" key={tag}>{tag}</span>)}</div><Link className="mt-6 inline-flex items-center gap-2 font-medium text-text-primary transition-colors hover:text-accent-green" href={project.href}>View case study <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></div></article></MotionWrapper>
}

export function ProjectsSection() {
  return <Section data-nav-section id="projects"><Container><SectionIntro eyebrow="03 / Selected work" title="Selected Work">A small selection of systems and products from the work archive.</SectionIntro><div className="grid gap-6 md:grid-cols-2">{projects.filter((project) => project.featured).map((project) => <ProjectCard key={project.id} project={project} />)}</div><div className="mt-10 flex justify-center"><Link className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-medium transition-colors hover:border-accent-green hover:text-accent-green" href="/projects">Explore all projects <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></div><div className="mt-20 rounded-xl border border-border bg-surface p-6 md:p-10"><div className="grid gap-8 lg:grid-cols-[0.8fr_1fr] lg:items-center"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">Engineering in motion</p><h3 className="mt-3 text-h3">Small decisions compound.</h3><p className="mt-4 text-text-secondary">The details of how a system evolves matter as much as its first release.</p></div><CommitGraph /></div></div></Container></Section>
}

export function PhilosophySection() {
  return <Section><Container><MotionWrapper className="mx-auto max-w-4xl text-center" variant="fadeUp"><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">Engineering philosophy</p><h2 className="mt-5 text-[clamp(2rem,5vw,4.5rem)] font-heading font-semibold leading-tight tracking-tight">Great software should be secure, maintainable, scalable, and intuitive.</h2><p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">I focus on building systems that solve the immediate problem without creating unnecessary complexity for the people who maintain or use them later.</p></MotionWrapper></Container></Section>
}

export function ExperienceSection() {
  return <Section><Container><SectionIntro eyebrow="04 / Experience" title="Where the work has taken me" /><div className="mx-auto max-w-3xl divide-y divide-border border-y border-border">{experience.map((item) => <MotionWrapper className="grid gap-4 py-8 md:grid-cols-[0.8fr_1.2fr]" key={item.id} variant="fadeUp"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{item.period}</p><h3 className="mt-2 text-xl font-semibold">{item.company}</h3></div><div><p className="text-lg text-text-primary">{item.role}</p>{item.highlights.map((highlight) => <p className="mt-3 text-text-secondary" key={highlight}>{highlight}</p>)}<div className="mt-4 flex flex-wrap gap-2">{item.technologies?.map((technology) => <span className="text-xs text-text-tertiary" key={technology}>{technology}</span>)}</div></div></MotionWrapper>)}</div></Container></Section>
}

export function TechnologiesSection() {
  const groups = [{ title: 'Frontend', names: ['React', 'Next.js', 'Inertia.js', 'Flutter', 'Dart', 'JavaScript', 'TypeScript', 'Tailwind CSS'] }, { title: 'Backend', names: ['Laravel', 'PHP', 'Python', 'FastAPI', 'REST APIs'] }, { title: 'Data', names: ['MySQL', 'SQL', 'Firebase', 'Firestore', 'PostgreSQL'] }, { title: 'AI / Computer Vision', names: ['YOLO', 'TensorFlow Lite', 'Vosk', 'AI integrations'] }, { title: 'Infrastructure / Tools', names: ['Git', 'GitHub Actions', 'MQTT', 'ESP32', 'Vercel', 'Docker'] }]
  const evidenced = new Set(technologies.map((technology) => technology.name))
  return <Section><Container><SectionIntro eyebrow="05 / Tools" title="Technologies">A practical stack shaped by the systems and products being built.</SectionIntro><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{groups.map((group) => <MotionWrapper key={group.title} variant="fadeUp"><div className="rounded-xl border border-border bg-surface p-5"><h3 className="font-semibold text-text-primary">{group.title}</h3><div className="mt-4 flex flex-wrap gap-2">{group.names.filter((name) => evidenced.has(name) || ['Flutter', 'Dart', 'Inertia.js', 'Tailwind CSS', 'FastAPI', 'REST APIs', 'Firestore', 'YOLO', 'TensorFlow Lite', 'Vosk', 'AI integrations', 'MQTT', 'ESP32'].includes(name)).map((name) => <span className="rounded-full bg-surface-muted px-3 py-1.5 text-sm text-text-secondary" key={name}>{name}</span>)}</div></div></MotionWrapper>)}</div></Container></Section>
}

export function CertificationsSection() {
  return <Section><Container><SectionIntro eyebrow="06 / Learning" title="Certifications" /><div className="grid gap-4 md:grid-cols-3">{certifications.map((certification) => <MotionWrapper key={certification.title} variant="fadeUp"><div className="rounded-xl border border-border p-5"><p className="text-lg font-semibold">{certification.title}</p><p className="mt-2 text-text-secondary">{certification.issuer}</p><p className="mt-4 text-sm text-text-tertiary">{certification.issueDate}</p></div></MotionWrapper>)}</div></Container></Section>
}

export function BlogPreviewSection() {
  return <Section><Container><div className="flex items-end justify-between gap-6"><SectionIntro eyebrow="07 / Notes" title="Latest Blog Posts" /><Link className="mb-12 hidden items-center gap-2 font-medium hover:text-accent-green sm:inline-flex" href="/blog">Read all <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></div><div className="grid gap-5 md:grid-cols-2">{blogPosts.map((post) => <MotionWrapper key={post.slug} variant="fadeUp"><article className="rounded-xl border border-border bg-surface p-6"><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{post.draft ? 'Draft note' : post.date}</p><h3 className="mt-3 text-h3">{post.title}</h3><p className="mt-3 text-text-secondary">{post.description}</p><Link className="mt-6 inline-flex items-center gap-2 font-medium hover:text-accent-green" href={`/blog/${post.slug}`}>Read note <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></article></MotionWrapper>)}</div></Container></Section>
}

export function ContactSection() {
  return <Section data-nav-section id="contact"><Container><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionIntro eyebrow="08 / Contact" title="Let’s Build Something Useful">I’m open to software development opportunities, collaborations, and projects where thoughtful engineering can make a practical difference.</SectionIntro><div className="space-y-3 text-text-secondary"><a className="block hover:text-accent-green" href="mailto:daniel@zimba.dev">daniel@zimba.dev</a>{SOCIAL_LINKS.filter((social) => social.name !== 'Email').map((social) => <a className="block hover:text-accent-green" href={social.href} key={social.name} rel="noreferrer" target="_blank">{social.name}</a>)}</div></div><MotionWrapper className="rounded-xl border border-border bg-surface p-6 md:p-8" variant="fadeUp"><ContactForm /></MotionWrapper></div></Container></Section>
}
