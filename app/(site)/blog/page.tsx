import type { Metadata } from 'next'
import { PostPreview } from '@/components/blog/PostPreview'
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
  const [latest, ...olderPosts] = posts

  return (
    <Section size="compact">
      <Container>
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">Notes</p>
          <h1 className="mt-3 text-display-lg">Blog</h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Working notes on software, systems, and the decisions behind them.
          </p>
        </header>

        {!latest ? (
          <p className="mt-10 border-y border-border py-12 text-lg text-text-secondary">
            Nothing published yet. Notes are on the way.
          </p>
        ) : (
          <div className="mt-10 space-y-12">
            <PostPreview featured post={latest} />
            {olderPosts.length > 0 && (
              <section aria-labelledby="more-articles">
                <h2
                  className="mb-6 font-mono text-sm uppercase tracking-[0.16em] text-text-secondary"
                  id="more-articles"
                >
                  More articles
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {olderPosts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </Container>
    </Section>
  )
}
