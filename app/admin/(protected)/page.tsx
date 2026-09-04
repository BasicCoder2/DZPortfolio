import Link from 'next/link'
import { getDashboardCounts } from '@/lib/content/admin-queries'
import { AdminPageHeader } from '@/components/admin/primitives'

/**
 * Admin dashboard.
 *
 * Answers one question — what needs attention — so drafts are the first
 * number on every card. Published counts are context; an unfinished draft is a
 * thing to go and do.
 */
export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts()

  const cards = [
    {
      href: '/admin/blog',
      label: 'Blog',
      primary: { value: counts.postsDraft, label: 'drafts' },
      secondary: { value: counts.postsPublished, label: 'published' },
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      primary: { value: counts.projectsDraft, label: 'drafts' },
      secondary: { value: counts.projectsPublished, label: 'published' },
    },
    {
      href: '/admin/experience',
      label: 'Experience',
      primary: { value: counts.experienceTotal - counts.experiencePublished, label: 'hidden' },
      secondary: { value: counts.experiencePublished, label: 'visible' },
    },
    {
      href: '/admin/certifications',
      label: 'Certifications',
      primary: {
        value: counts.certificationsTotal - counts.certificationsPublished,
        label: 'hidden',
      },
      secondary: { value: counts.certificationsPublished, label: 'visible' },
    },
    {
      href: '/admin/engagement',
      label: 'Engagement',
      primary: { value: counts.engagementTotal - counts.engagementPublished, label: 'hidden' },
      secondary: { value: counts.engagementPublished, label: 'visible' },
    },
  ]

  const totalDrafts =
    counts.postsDraft +
    counts.projectsDraft +
    (counts.experienceTotal - counts.experiencePublished) +
    (counts.certificationsTotal - counts.certificationsPublished) +
    (counts.engagementTotal - counts.engagementPublished)

  return (
    <>
      <AdminPageHeader
        description={
          totalDrafts === 0
            ? 'Everything is published. Nothing is waiting on you.'
            : `${totalDrafts} item${totalDrafts === 1 ? '' : 's'} not yet visible on the site.`
        }
        eyebrow="Overview"
        title="Dashboard"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            className="group flex flex-col rounded-md border border-border bg-surface p-5 transition-colors hover:border-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            href={card.href}
            key={card.href}
          >
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-text-tertiary group-hover:text-accent-green">
              {card.label}
            </span>
            <span className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tabular-nums text-text-primary">
                {card.primary.value}
              </span>
              <span className="text-sm text-text-secondary">{card.primary.label}</span>
            </span>
            <span className="mt-2 text-sm text-text-tertiary">
              {card.secondary.value} {card.secondary.label}
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-md border border-border p-6">
        <h2 className="text-sm font-medium text-text-primary">How publishing works</h2>
        <ul className="mt-4 space-y-2 text-sm text-text-secondary">
          <li>
            — Drafts are invisible to visitors. They are refused by the database, not just hidden by
            the page.
          </li>
          <li>
            — Publishing rebuilds the affected public pages immediately; the rest refresh on their
            own within five minutes.
          </li>
          <li>— Preview a draft from its editor before it goes live.</li>
        </ul>
      </section>
    </>
  )
}
