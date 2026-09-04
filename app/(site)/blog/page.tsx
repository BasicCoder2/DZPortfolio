import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/layout'
import { listPublishedPosts } from '@/lib/content/repositories'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: 'Blog',
  description: 'Engineering notes and working ideas from Daniel Zimba.',
  path: '/blog',
})

/**
 * Prerendered, revalidated every five minutes.
 *
 * The literal is not an oversight: Next statically analyses route segment
 * config at build time, so `revalidate` must be a literal and an imported
 * constant is rejected outright. Keep these six routes in step by hand — they
 * are listed in docs/CONTENT_PLATFORM.md.
 *
 * The timer is only the fallback. Publishing from the admin area calls
 * revalidatePath on the affected routes immediately (lib/content/cache.ts).
 */
export const revalidate = 300

export default async function BlogPage() {
  const posts = await listPublishedPosts()

  return (
    <Section>
      <Container size="prose">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">Notes</p>
          <h1 className="mt-3 text-display-lg">Blog</h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Working notes on software, systems, and the decisions behind them.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="mt-16 border-y border-border py-12 text-lg text-text-secondary">
            Nothing published yet. Notes are on the way.
          </p>
        ) : (
          <div className="mt-16 divide-y divide-border border-y border-border">
            {posts.map((post) => (
              <article className="py-8" key={post.id}>
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                  <span className="text-text-tertiary">{post.readingTime}</span>
                </div>
                <h2 className="mt-4 text-h3">{post.title}</h2>
                {post.excerpt !== '' && (
                  <p className="mt-3 text-lg leading-8 text-text-secondary">{post.excerpt}</p>
                )}
                <Link
                  className="mt-6 inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
                  href={`/blog/${post.slug}`}
                >
                  Read note <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
