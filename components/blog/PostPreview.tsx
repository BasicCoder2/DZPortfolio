import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/lib/content/models'
import { PostCover } from './PostCover'

export function PostPreview({ post, featured = false }: { post: Post; featured?: boolean }) {
  const href = `/blog/${post.slug}`
  return (
    <article
      className={`group overflow-hidden rounded-xl border border-border bg-surface ${featured && post.coverImageUrl ? 'lg:grid lg:grid-cols-[1.2fr_1fr]' : 'flex flex-col'}`}
    >
      {post.coverImageUrl && (
        <div
          className={`relative block aspect-video overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-green ${featured ? 'lg:h-full lg:min-h-80' : ''}`}
        >
          <PostCover
            alt={post.coverImageAlt ?? ''}
            sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 640px"
            src={post.coverImageUrl}
          />
        </div>
      )}
      <div
        className={`flex flex-1 flex-col p-6 ${featured ? 'md:p-9 lg:justify-center' : 'md:p-7'}`}
      >
        {featured && (
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            Latest article
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}
          <span>{post.readingTime}</span>
        </div>
        <h2 className={`mt-4 ${featured ? 'text-h2' : 'text-h3'}`}>
          <Link className="transition-colors hover:text-accent-green" href={href}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-4 leading-7 text-text-secondary">{post.excerpt}</p>}
        <div className="mt-7">
          <Link
            className="inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
            href={href}
          >
            Read article <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
