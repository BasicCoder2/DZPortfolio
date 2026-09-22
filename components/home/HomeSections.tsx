import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ContentImage } from '@/components/ui/content-image'
import { PostCover } from '@/components/blog/PostCover'
import { Container, Section } from '@/components/layout'
import { ContactForm } from '@/components/contact'
import { services } from '@/data/services'
import { serviceIcons } from '@/components/home/ServiceIcons'
import { technologies } from '@/data/technologies'
import {
  listFeaturedProjects,
  listPublishedCertifications,
  listPublishedEngagementOptions,
  listPublishedExperience,
  listPublishedPosts,
} from '@/lib/content/repositories'
import type { Project } from '@/lib/content/models'
import { CONTACT_EMAIL, RECENT_POSTS_COUNT, SOCIAL_LINKS } from '@/lib/constants'

const technologyGroups = [
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
  { title: 'AI / Computer Vision', names: ['YOLO', 'TensorFlow Lite', 'Vosk', 'AI integrations'] },
  {
    title: 'Infrastructure / Tools',
    names: ['Git', 'GitHub Actions', 'MQTT', 'ESP32', 'Vercel', 'Docker'],
  },
]

function ProjectFeature({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, '0')
  const mediaOnRight = index % 2 === 1

  return (
    <article className="border-t border-border py-12 first:pt-8 md:py-16 lg:py-20">
      <div className="mb-7 flex items-center justify-between gap-6 font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
        <span>Project {number}</span>
        {project.category && (
          <span className="text-right text-accent-green">{project.category}</span>
        )}
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-center lg:gap-14 xl:gap-20">
        <div className={mediaOnRight ? 'lg:order-2' : undefined}>
          <h3 className="text-h2 lg:hidden">{project.title}</h3>
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-md border border-border bg-surface-muted lg:mt-0">
            {project.previewImageUrl ? (
              <ContentImage
                fill
                alt={project.previewImageAlt ?? ''}
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 1023px) 100vw, 66vw"
                src={project.previewImageUrl}
              />
            ) : (
              <div aria-hidden="true" className="flex h-full items-center justify-center">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary">
                  {project.category || 'Project'}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={mediaOnRight ? 'lg:order-1' : undefined}>
          <h3 className="hidden text-h2 lg:block">{project.title}</h3>
          {project.summary && (
            <p className="mt-5 max-w-xl text-lg leading-8 text-text-secondary">{project.summary}</p>
          )}
          {project.technologies.length > 0 && (
            <ul
              aria-label="Selected technologies"
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-tertiary"
            >
              {project.technologies.slice(0, 3).map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          )}
          <Link
            className="mt-8 inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium transition-colors hover:border-accent-green hover:text-accent-green"
            href={project.href}
          >
            Read case study <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export async function ProjectsSection() {
  const featured = await listFeaturedProjects()
  return (
    <Section data-nav-section id="work" size="spacious">
      <Container>
        <header className="mb-10 grid gap-6 border-b border-border pb-8 md:mb-14 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="text-display-md">Systems built for real operations.</h2>
          </div>
          <p className="max-w-md text-text-secondary md:text-right">
            Governance, commerce and connected products shaped around the work people actually do.
          </p>
        </header>
        {featured.length === 0 ? (
          <p className="border-b border-border py-12 text-lg text-text-secondary">
            Project write-ups are being prepared.
          </p>
        ) : (
          <div>
            {featured.map((project, index) => (
              <ProjectFeature index={index} key={project.id} project={project} />
            ))}
          </div>
        )}
        <div className="border-t border-border pt-8">
          <Link
            className="inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium transition-colors hover:border-accent-green hover:text-accent-green"
            href="/projects"
          >
            Explore the project archive <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

export async function AboutExperienceSection() {
  const entries = await listPublishedExperience()
  return (
    <Section data-nav-section id="about">
      {/* Deliberately not eyebrow → h2 → subhead → grid, the pattern every
          other section on the page follows. The statement runs full-bleed
          and oversized, closer to a pull-quote than a section header, and
          the roles beneath it read as a plain list rather than a second
          bordered card grid. */}
      <Container>
        <h2 className="max-w-4xl text-[clamp(2rem,5.5vw,3.75rem)] font-heading font-medium leading-[1.08] tracking-tight text-text-primary">
          Daniel Zimba is a software developer focused on operational systems.
        </h2>
      </Container>
      <Container className="mt-10 md:mt-14">
        <div className="grid gap-14 lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)] lg:gap-20">
          <div className="space-y-4 text-lg leading-8 text-text-secondary lg:pt-2">
            <p>
              My work spans enterprise applications, web platforms, mobile development, AI-powered
              systems and IoT.
            </p>
            <p>
              I translate complex institutional and business requirements into software that is
              usable, maintainable and reliable.
            </p>
          </div>
          <div>
            {entries.length === 0 ? (
              <p className="text-text-secondary">Experience details are being prepared.</p>
            ) : (
              <ol className="space-y-8">
                {entries.map((item, index) => (
                  <li className="grid grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[3rem_1fr]" key={item.id}>
                    <span
                      aria-hidden="true"
                      className="font-heading text-2xl font-medium text-text-tertiary/60"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <article>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-xl font-semibold">{item.organization}</h3>
                        {item.period && (
                          <p className="text-sm text-text-tertiary">{item.period}</p>
                        )}
                      </div>
                      <p className="mt-1 text-text-primary">{item.role}</p>
                      {item.summary && (
                        <p className="mt-3 max-w-2xl text-text-secondary">{item.summary}</p>
                      )}
                      {item.location && (
                        <p className="mt-3 text-sm text-text-tertiary">{item.location}</p>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function ServicesSection() {
  const featured = services.find((service) => service.id === 'ai-solutions')
  const rest = services.filter((service) => service.id !== 'ai-solutions')
  return (
    <Section size="compact">
      <Container>
        <h2 className="text-h2">What I work on</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          {/* AI Solutions is the differentiator, so it gets its own card,
              the warm accent (used nowhere else on this page as a card
              background), and the other services' full highlight list —
              not just a bordered row like everything else here. */}
          {featured && (
            <article className="rounded-2xl border border-accent-warm/25 bg-accent-warm-dim p-8 lg:p-10">
              <ServiceIcon className="text-accent-warm" id={featured.id} />
              <h3 className="mt-6 text-h3">{featured.title}</h3>
              <p className="mt-3 max-w-md leading-7 text-text-secondary">{featured.description}</p>
              {featured.highlights && featured.highlights.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {featured.highlights.map((highlight) => (
                    <li className="flex items-start gap-2.5 text-sm text-text-primary" key={highlight}>
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warm" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          )}
          <div className="flex flex-col gap-6">
            {rest.map((service) => (
              <article
                className="flex-1 rounded-2xl border border-border bg-surface-muted p-6"
                key={service.id}
              >
                <ServiceIcon className="text-accent-green" id={service.id} />
                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function ServiceIcon({ id, className }: { id: string; className?: string }) {
  const Icon = serviceIcons[id]
  if (!Icon) return null
  return <Icon className={className} />
}

export function PhilosophySection() {
  return (
    <Section size="spacious" tone="surface">
      <Container>
        <div className="grid gap-8 border-l-2 border-accent-green pl-6 md:pl-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end lg:gap-16">
          <div>
            {/* The accent border alone marks this as a principle callout;
                no eyebrow label needed to say so. */}
            <h2 className="max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-heading font-semibold leading-[1.05] tracking-tight">
              Software should explain the business it represents.
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-text-secondary">
            That means modelling workflows and business states explicitly, defining authorization
            and integration boundaries, and leaving maintainable software behind.
          </p>
        </div>
      </Container>
    </Section>
  )
}

export async function EvidenceSection() {
  const certifications = await listPublishedCertifications()
  const evidenced = new Set(technologies.map((technology) => technology.name))
  return (
    // Full-bleed warm wash — the one place besides the AI Solutions card and
    // the recommended engagement path that carries the secondary accent, and
    // the only section background on the page that isn't the default or
    // surface tone.
    <section className="border-y border-accent-warm/20 bg-accent-warm-dim py-16 md:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(16rem,0.55fr)_minmax(0,1.45fr)] lg:gap-16">
          <div>
            <h2 className="text-h3">Built with tools proven in production, not just in demos.</h2>
            {certifications.length > 0 && (
              <ul className="mt-8 space-y-4 border-t border-accent-warm/25 pt-6">
                {certifications.map((certification) => (
                  <li key={certification.id}>
                    {certification.credentialUrl ? (
                      <a
                        className="font-semibold hover:text-accent-warm"
                        href={certification.credentialUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {certification.title}
                      </a>
                    ) : (
                      <p className="font-semibold">{certification.title}</p>
                    )}
                    <p className="mt-1 text-sm text-text-secondary">
                      {certification.issuer}
                      {certification.issuedLabel !== '—' ? ` · ${certification.issuedLabel}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Technologies as a loose, flowing cluster of tags rather than
              grouped columns — reads as breadth, not an inventory list. */}
          <div className="flex flex-wrap content-start gap-2.5">
            {technologyGroups.flatMap((group) =>
              group.names
                .filter((name) => evidenced.has(name))
                .map((name) => (
                  <span
                    className="rounded-full border border-accent-warm/25 bg-surface-elevated px-3.5 py-1.5 text-sm text-text-primary"
                    key={name}
                    title={group.title}
                  >
                    {name}
                  </span>
                )),
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export async function BlogPreviewSection() {
  const posts = await listPublishedPosts(RECENT_POSTS_COUNT)
  return (
    <Section data-nav-section id="writing">
      <Container>
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7">
          <div>
            <p className="mb-2 font-heading text-lg italic text-text-secondary">Recent writing</p>
            <h2 className="text-h2">Notes on systems and decisions.</h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
            href="/blog"
          >
            View all writing <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </header>
        {posts.length === 0 ? (
          <p className="border-b border-border py-12 text-lg text-text-secondary">
            Notes are on the way.
          </p>
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {posts.map((post) => (
              <article
                className={`grid gap-6 py-8 md:items-center ${post.coverImageUrl ? 'md:grid-cols-[12rem_1fr_auto]' : 'md:grid-cols-[1fr_auto]'}`}
                key={post.id}
              >
                {post.coverImageUrl && (
                  <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-surface-muted">
                    <PostCover
                      alt={post.coverImageAlt ?? ''}
                      sizes="(max-width: 767px) 100vw, 192px"
                      src={post.coverImageUrl}
                    />
                  </div>
                )}
                <div>
                  {post.publishedAt && (
                    <time
                      className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary"
                      dateTime={post.publishedAt}
                    >
                      {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </time>
                  )}
                  <h3 className="mt-2 text-h3">
                    <Link className="hover:text-accent-green" href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 max-w-2xl text-text-secondary">{post.excerpt}</p>
                  )}
                </div>
                <Link
                  className="inline-flex items-center gap-2 font-medium hover:text-accent-green"
                  href={`/blog/${post.slug}`}
                >
                  Read <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

export async function WorkWithMeSection() {
  const options = await listPublishedEngagementOptions()
  if (options.length === 0) return null
  return (
    <Section size="spacious">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(14rem,0.5fr)_minmax(0,1.5fr)] lg:gap-20">
          <header>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              Engagement
            </p>
            <h2 className="mt-3 text-display-md">Work with me</h2>
          </header>
          {/* Renders whatever tiers are published, with their own title,
              price and copy — not a synthesized "have a project? / still
              defining it?" framing standing in for the real data. */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {options.map((option) =>
              option.recommended ? (
                // The recommended tier gets an actual elevated card — a
                // distinct surface, border and shadow — instead of a pill
                // floated on a divider line.
                <article
                  className="rounded-2xl border border-accent-warm/30 bg-surface-elevated p-8 shadow-lg"
                  key={option.id}
                >
                  <p className="text-sm font-medium text-accent-warm">Recommended</p>
                  <h3 className="mt-2 text-h3">{option.title}</h3>
                  <p className="mt-4 text-2xl font-semibold text-text-primary">
                    {option.priceDisplay}
                  </p>
                  <p className="mt-4 leading-7 text-text-secondary">{option.description}</p>
                  {option.items.length > 0 && (
                    <ul className="mt-6 space-y-2 text-sm text-text-primary">
                      {option.items.map((item) => (
                        <li key={item}>— {item}</li>
                      ))}
                    </ul>
                  )}
                  <a
                    className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent-warm px-5 py-2.5 text-sm font-medium text-accent-warm-foreground transition-colors hover:brightness-110"
                    href="#contact"
                  >
                    Discuss this option <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </article>
              ) : (
                <article
                  className="rounded-2xl border border-border bg-surface-muted p-8"
                  key={option.id}
                >
                  <h3 className="text-h3">{option.title}</h3>
                  <p className="mt-4 text-2xl font-semibold text-text-primary">
                    {option.priceDisplay}
                  </p>
                  <p className="mt-4 leading-7 text-text-secondary">{option.description}</p>
                  {option.items.length > 0 && (
                    <ul className="mt-6 space-y-2 text-sm text-text-tertiary">
                      {option.items.map((item) => (
                        <li key={item}>— {item}</li>
                      ))}
                    </ul>
                  )}
                  <a
                    className="mt-7 inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
                    href="#contact"
                  >
                    Discuss this option <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </article>
              ),
            )}
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-5 text-sm text-text-tertiary">
          Institutional systems · Web applications · APIs · Mobile · AI integrations
        </p>
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
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
              Contact
            </p>
            <h2 className="mt-3 text-display-md">Have a system to build?</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-text-secondary">
              Tell me what you&apos;re working on, where the project currently stands and what you
              need help with.
            </p>
            <div className="mt-8 space-y-3 text-text-secondary">
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
          <div className="border-t border-border bg-surface-elevated pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  )
}
