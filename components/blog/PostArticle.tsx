import Image from 'next/image'
import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { Markdown } from '@/lib/content/markdown'
import type { Post } from '@/lib/content/models'

/**
 * The rendered body of a blog post.
 *
 * Shared by the public route and the admin draft preview, so what an operator
 * approves is literally the component that ships — a preview that renders
 * through a second, "close enough" code path is a preview that eventually
 * lies.
 *
 * The page owns the single `<h1>`; `<Markdown>` pushes author headings down to
 * `<h2>` and below. That is the fix for the duplicate H1 the old MDX article
 * shipped with, where the file began with `# Building Useful Systems` while
 * the page rendered the same title in its own `<h1>` above it.
 */
export function PostArticle({ post, preview }: { post: Post; preview?: boolean }) {
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Draft'

  return (
    <Section>
      <Container size="prose">
        {!preview && (
          <Link className="text-sm text-text-secondary hover:text-accent-green" href="/blog">
            ← Back to blog
          </Link>
        )}

        <p className="mt-12 flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
          <span>{dateLabel}</span>
          <span className="text-text-tertiary">{post.readingTime}</span>
        </p>

        <h1 className="mt-3 text-display-lg">{post.title}</h1>

        {post.excerpt !== '' && <p className="mt-5 text-xl text-text-secondary">{post.excerpt}</p>}

        {post.coverImageUrl && (
          <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-md border border-border">
            {/* Intrinsic dimensions are unknown until runtime, so `fill` inside
                a fixed-ratio frame is what lets this go through the optimizer
                at all. The ratio is the site's, not the file's — a cover is a
                crop, and letterboxing an arbitrary upload would look worse. */}
            <Image
              fill
              alt={post.coverImageAlt ?? ''}
              className="object-cover"
              sizes="(max-width: 767px) 100vw, 720px"
              src={post.coverImageUrl}
            />
          </figure>
        )}

        <article className="mt-12">
          <Markdown headingOffset={1}>{post.content}</Markdown>
        </article>
      </Container>
    </Section>
  )
}
