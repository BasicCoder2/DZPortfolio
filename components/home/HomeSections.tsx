import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
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
import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/lib/constants'

const icons = { Building2, Globe2, Layers3, Smartphone, Sparkles }

function SectionIntro({
  eyebrow,
  title,
  children,
  className = 'mb-12',
  quiet = false,
}: {
  eyebrow: string
  title: string
  children?: ReactNode
  /** Lets a caller hand the bottom margin to a shared row instead. */
  className?: string
  /** Reference sections announce themselves more softly than the centrepieces. */
  quiet?: boolean
}) {
  return (
    <MotionWrapper className={`max-w-2xl ${className}`} variant="fadeUp">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
        {eyebrow}
      </p>
      <h2 className={quiet ? 'text-h3' : 'text-h2'}>{title}</h2>
      {children && (
        <p className={`mt-4 text-text-secondary ${quiet ? 'leading-7' : 'text-lg leading-8'}`}>
          {children}
        </p>
      )}
    </MotionWrapper>
  )
}

export function AboutSection() {
  return (
    <Section data-nav-section id="about">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:items-center lg:gap-24">
          <div>
            <SectionIntro eyebrow="About" title="About">
              I’m Daniel Zimba, a Software Developer focused on building practical digital systems
              that solve real-world problems.
            </SectionIntro>
            <div className="max-w-2xl space-y-5 text-lg leading-8 text-text-secondary">
              <p>
                My work spans enterprise applications, web platforms, mobile development, AI-powered
                systems, and IoT.
              </p>
              <p>
                I enjoy turning complex requirements into software that is usable, maintainable, and
                reliable.
              </p>
            </div>
          </div>
          {/* w-full is required: justify-self-end makes the grid item shrink to
              fit its content, which collapsed the terminal to the width of its
              longest line instead of the column. */}
          <MotionWrapper className="w-full lg:justify-self-end" variant="fadeRight">
            <Terminal />
          </MotionWrapper>
        </div>
      </Container>
    </Section>
  )
}

export function ServicesSection() {
  return (
    <Section data-nav-section id="services">
      <Container>
        <SectionIntro eyebrow="Capabilities" title="What I Build">
          Building enterprise systems, AI-powered applications and digital products.
        </SectionIntro>
        <div className="divide-y divide-border border-y border-border">
          {services.map((service) => {
            const Icon = icons[service.icon as keyof typeof icons] ?? Layers3
            return (
              <MotionWrapper
                className="group grid gap-5 py-7 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-8"
                key={service.id}
                variant="fadeUp"
              >
                <div>
                  <Icon
                    aria-hidden="true"
                    className="mb-4 h-6 w-6 text-accent-green transition-transform duration-300 group-hover:-translate-y-1"
                  />
                  <h3 className="text-h3">{service.title}</h3>
                </div>
                <div>
                  <p className="max-w-xl text-text-secondary">{service.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-tertiary">
                    {service.highlights.map((highlight) => (
                      <li key={highlight}>— {highlight}</li>
                    ))}
                  </ul>
                </div>
              </MotionWrapper>
            )
          })}
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              A considered stack
            </p>
            <h3 className="mt-3 text-h3">Technology with a point of view.</h3>
            <p className="mt-4 max-w-lg text-text-secondary">
              The tools matter, but the system they help people use matters more.
            </p>
          </div>
          <TechnologyRing />
        </div>
      </Container>
    </Section>
  )
}

export function PricingSection() {
  return (
    <Section>
      <Container>
        <SectionIntro eyebrow="Engagement" title="A useful way to start">
          Choose the level of clarity or delivery that matches where the work is today.
        </SectionIntro>
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
          {pricingOptions.map((option) => (
            <MotionWrapper
              className={`relative border-t-2 pt-6 ${option.recommended ? 'border-accent-green' : 'border-border-strong'}`}
              key={option.id}
              variant="fadeUp"
            >
              {/* The badge straddles the column rule instead of sitting in the
                  flow, so all three headings keep full width and one baseline. */}
              {option.recommended && (
                <span className="absolute right-0 top-0 -translate-y-1/2 rounded-full bg-accent-green px-3 py-1 text-xs font-medium text-accent-foreground">
                  Recommended
                </span>
              )}
              <h3 className="text-h3">{option.title}</h3>
              <p className="mt-4 text-2xl font-semibold text-text-primary">{option.price}</p>
              <p className="mt-4 text-text-secondary">{option.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-text-tertiary">
                {option.items.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function ProjectCard({ project, lead }: { project: (typeof projects)[number]; lead?: boolean }) {
  return (
    <MotionWrapper className={lead ? 'md:col-span-2' : undefined} variant="fadeUp">
      {/* The lead card splits horizontally rather than stacking, so spanning
          two columns doesn't hand the cover image half the section's height. */}
      <article
        className={`group h-full overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-card transition-shadow duration-300 hover:shadow-card-elevated ${lead ? 'md:grid md:grid-cols-2 md:items-stretch' : ''}`}
      >
        {/* Neutral fill behind the cover so a real screenshot that doesn't fill
            the frame (or carries transparency) still sits on a defined plane. */}
        <div
          className={`relative overflow-hidden bg-surface-muted border-border ${lead ? 'aspect-[16/9] border-b md:aspect-auto md:min-h-64 md:border-b-0 md:border-r' : 'aspect-[16/9] border-b'}`}
        >
          <Image
            fill
            alt={`${project.title} project preview`}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 767px) 100vw, 50vw"
            src={project.coverImage ?? '/assets/projects/lmmu-governance-admissions.svg'}
          />
        </div>
        <div className={`p-6 md:p-7 ${lead ? 'md:flex md:flex-col md:justify-center' : ''}`}>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            {project.category}
          </p>
          <h3 className="mt-3 text-h3">{project.title}</h3>
          <p className="mt-3 text-text-secondary">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-tertiary">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <Link
            className="mt-6 inline-flex items-center gap-2 font-medium text-text-primary transition-colors hover:text-accent-green"
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

export function ProjectsSection() {
  return (
    <Section data-nav-section id="projects" size="spacious">
      <Container>
        <SectionIntro eyebrow="Selected work" title="Selected Work">
          A small selection of systems and products from the work archive.
        </SectionIntro>
        {/* An odd number of featured projects would orphan the last card in a
            two-column grid, so the first one leads across the full width. */}
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {projects
            .filter((project) => project.featured)
            .map((project, index, list) => (
              <ProjectCard
                key={project.id}
                lead={list.length % 2 === 1 && index === 0}
                project={project}
              />
            ))}
        </div>
        <div className="mt-10 flex justify-start">
          <Link
            className="inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium transition-colors hover:border-accent-green hover:text-accent-green"
            href="/projects"
          >
            Explore all projects <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-20 grid gap-8 border-t border-border pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              Engineering in motion
            </p>
            <h3 className="mt-3 text-h3">Small decisions compound.</h3>
            <p className="mt-4 text-text-secondary">
              The details of how a system evolves matter as much as its first release.
            </p>
          </div>
          <CommitGraph />
        </div>
      </Container>
    </Section>
  )
}

export function PhilosophySection() {
  return (
    <Section size="spacious" tone="surface">
      <Container>
        <MotionWrapper className="mx-auto max-w-4xl py-8 text-center md:py-16" variant="fadeUp">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            Engineering philosophy
          </p>
          <h2 className="mt-5 text-[clamp(2rem,5vw,4.5rem)] font-heading font-semibold leading-tight tracking-tight">
            Great software should be secure, maintainable, scalable, and intuitive.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            I focus on building systems that solve the immediate problem without creating
            unnecessary complexity for the people who maintain or use them later.
          </p>
        </MotionWrapper>
      </Container>
    </Section>
  )
}

export function ExperienceSection() {
  return (
    <Section>
      <Container>
        <SectionIntro eyebrow="Experience" title="Where the work has taken me" />
        <div className="mx-auto max-w-4xl divide-y divide-border border-y border-border">
          {experience.map((item) => (
            <MotionWrapper
              className="grid gap-4 py-8 md:grid-cols-[0.8fr_1.2fr] md:gap-10"
              key={item.id}
              variant="fadeUp"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                  {item.period}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{item.company}</h3>
              </div>
              <div>
                <p className="text-lg text-text-primary">{item.role}</p>
                {item.highlights.map((highlight) => (
                  <p className="mt-3 text-text-secondary" key={highlight}>
                    {highlight}
                  </p>
                ))}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-tertiary">
                  {item.technologies?.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function TechnologiesSection() {
  const groups = [
    {
      title: 'Frontend',
      names: [
        'React',
        'Next.js',
        'Inertia.js',
        'Flutter',
        'Dart',
        'JavaScript',
        'TypeScript',
        'Tailwind CSS',
      ],
    },
    { title: 'Backend', names: ['Laravel', 'PHP', 'Python', 'FastAPI', 'REST APIs'] },
    { title: 'Data', names: ['MySQL', 'SQL', 'Firebase', 'Firestore', 'PostgreSQL'] },
    {
      title: 'AI / Computer Vision',
      names: ['YOLO', 'TensorFlow Lite', 'Vosk', 'AI integrations'],
    },
    {
      title: 'Infrastructure / Tools',
      names: ['Git', 'GitHub Actions', 'MQTT', 'ESP32', 'Vercel', 'Docker'],
    },
  ]
  const evidenced = new Set(technologies.map((technology) => technology.name))
  return (
    <Section size="compact">
      <Container>
        <SectionIntro quiet eyebrow="Tools" title="Technologies">
          A practical stack shaped by the systems and products being built.
        </SectionIntro>
        <div className="grid gap-x-10 gap-y-8 border-y border-border py-2 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <MotionWrapper
              className="border-b border-border py-6 last:border-b-0"
              key={group.title}
              variant="fadeUp"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                {group.title}
              </h3>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-text-secondary">
                {group.names
                  .filter(
                    (name) =>
                      evidenced.has(name) ||
                      [
                        'Flutter',
                        'Dart',
                        'Inertia.js',
                        'Tailwind CSS',
                        'FastAPI',
                        'REST APIs',
                        'Firestore',
                        'YOLO',
                        'TensorFlow Lite',
                        'Vosk',
                        'AI integrations',
                        'MQTT',
                        'ESP32',
                      ].includes(name)
                  )
                  .map((name) => (
                    <li key={name}>{name}</li>
                  ))}
              </ul>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function CertificationsSection() {
  return (
    <Section size="compact">
      <Container>
        <SectionIntro quiet eyebrow="Learning" title="Certifications" />
        <div className="divide-y divide-border border-y border-border">
          {certifications.map((certification) => (
            <MotionWrapper
              className="grid gap-2 py-6 md:grid-cols-[1fr_0.7fr_0.5fr] md:items-center"
              key={certification.title}
              variant="fadeUp"
            >
              <p className="text-lg font-semibold">{certification.title}</p>
              <p className="text-text-secondary">{certification.issuer}</p>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary md:text-right">
                {certification.issueDate}
              </p>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function BlogPreviewSection() {
  return (
    <Section>
      <Container>
        {/* The row owns the bottom margin so the link aligns with the heading
            block without mirroring SectionIntro's spacing by hand. */}
        <div className="mb-12 flex items-end justify-between gap-6">
          <SectionIntro className="" eyebrow="Notes" title="Latest Blog Posts" />
          <Link
            className="hidden shrink-0 items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green sm:inline-flex"
            href="/blog"
          >
            Read all <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {blogPosts.map((post) => (
            <MotionWrapper key={post.slug} variant="fadeUp">
              <article className="grid gap-4 py-7 md:grid-cols-[0.25fr_1fr_auto] md:items-center md:gap-8">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                  {post.draft ? 'Draft note' : post.date}
                </p>
                <div>
                  <h3 className="text-h3">{post.title}</h3>
                  <p className="mt-2 text-text-secondary">{post.description}</p>
                </div>
                <Link
                  className="inline-flex items-center gap-2 font-medium hover:text-accent-green"
                  href={`/blog/${post.slug}`}
                >
                  Read note <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            </MotionWrapper>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function ContactSection() {
  return (
    <Section data-nav-section id="contact" size="spacious" tone="surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionIntro eyebrow="Contact" title="Let’s Build Something Useful">
              I’m open to software development opportunities, collaborations, and projects where
              thoughtful engineering can make a practical difference.
            </SectionIntro>
            <div className="space-y-3 text-text-secondary">
              <a className="block hover:text-accent-green" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              {SOCIAL_LINKS.filter((social) => social.name !== 'Email').map((social) => (
                <a
                  className="block hover:text-accent-green"
                  href={social.href}
                  key={social.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
          {/* The section sits on the surface plane, so the form has to rise to
              the elevated one to stay legible as a distinct panel. */}
          <MotionWrapper
            className="rounded-xl border border-border bg-surface-elevated p-6 shadow-card md:p-8"
            variant="fadeUp"
          >
            <ContactForm />
          </MotionWrapper>
        </div>
      </Container>
    </Section>
  )
}
