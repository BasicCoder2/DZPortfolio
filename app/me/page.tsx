import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react'
import { Container, Section } from '@/components/layout'
import { siteConfig } from '@/data/site'
import { SOCIAL_LINKS } from '@/lib/constants'
import { constructMetadata } from '@/lib/metadata'

export const metadata = constructMetadata({
  title: `${siteConfig.author.name} — Profile`,
  description: `${siteConfig.author.role}. ${siteConfig.profile.summary}`,
  path: '/me',
})

/**
 * Renders where a link actually goes, so a reader can see the destination
 * before clicking — more use on a professional card than a generic "GitHub"
 * button, and it doubles as the handle itself.
 */
function displayTarget(href: string): string {
  if (href.startsWith('mailto:')) return href.slice('mailto:'.length)
  return href
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

/**
 * Shareable profile card.
 *
 * Deliberately not a second About page: its job is to be one short URL you can
 * paste into a GitHub bio, an email signature or a LinkedIn website field, and
 * have every way of reaching Daniel visible without scrolling. Everything here
 * reads from `siteConfig` and `SOCIAL_LINKS` so it cannot drift from the rest
 * of the site.
 */
export default function ProfilePage() {
  const { author, profile, cvPath } = siteConfig

  // The card is centred in the viewport below the nav so it reads without
  // scrolling; compact padding acts as a floor on short screens.
  return (
    <Section className="flex min-h-[calc(100svh-var(--nav-h))] items-center" size="compact">
      <Container>
        <article className="mx-auto max-w-lg rounded-xl border border-border bg-surface-elevated p-5 shadow-card-elevated sm:p-7 md:p-9">
          <header className="flex items-center gap-5">
            <Image
              priority
              alt=""
              className="h-20 w-20 shrink-0 rounded-full border border-border object-cover object-center"
              height={160}
              sizes="80px"
              src={profile.avatar}
              width={160}
            />
            <div className="min-w-0">
              <h1 className="text-h3">{author.name}</h1>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                {author.role}
              </p>
              {profile.location && (
                <p className="mt-2 text-sm text-text-tertiary">{profile.location}</p>
              )}
            </div>
          </header>

          <p className="mt-6 leading-7 text-text-secondary">{profile.summary}</p>

          {profile.availability && (
            <p className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rounded-full bg-success ring-4 ring-success/15"
              />
              {profile.availability}
            </p>
          )}

          <ul className="mt-8 divide-y divide-border border-y border-border">
            {SOCIAL_LINKS.map((social) => {
              const isMail = social.href.startsWith('mailto:')
              return (
                <li key={social.name}>
                  <a
                    aria-label={social.ariaLabel}
                    className="group flex items-baseline gap-3 py-3.5 sm:gap-4 transition-colors hover:text-accent-green"
                    href={social.href}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    target={isMail ? undefined : '_blank'}
                  >
                    <span className="w-[4.5rem] shrink-0 font-mono sm:w-20 text-xs uppercase tracking-[0.16em] text-text-tertiary transition-colors group-hover:text-accent-green">
                      {social.name}
                    </span>
                    <span className="min-w-0 flex-1 break-words text-sm text-text-primary transition-colors group-hover:text-accent-green">
                      {displayTarget(social.href)}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 self-center text-text-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-green"
                    />
                  </a>
                </li>
              )
            })}

            <li>
              <a
                download
                className="group flex items-baseline gap-3 py-3.5 sm:gap-4 transition-colors hover:text-accent-green"
                href={cvPath}
              >
                <span className="w-[4.5rem] shrink-0 font-mono sm:w-20 text-xs uppercase tracking-[0.16em] text-text-tertiary transition-colors group-hover:text-accent-green">
                  CV
                </span>
                <span className="min-w-0 flex-1 break-words text-sm text-text-primary transition-colors group-hover:text-accent-green">
                  Download as PDF
                </span>
                <Download
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 self-center text-text-tertiary transition-transform group-hover:translate-y-0.5 group-hover:text-accent-green"
                />
              </a>
            </li>
          </ul>

          <Link
            className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-text-primary transition-colors hover:text-accent-green"
            href="/"
          >
            View the full portfolio
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </article>
      </Container>
    </Section>
  )
}
