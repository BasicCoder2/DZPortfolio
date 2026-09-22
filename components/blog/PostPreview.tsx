import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/lib/content/models'
import { PostCover } from './PostCover'

export function PostPreview({ post, featured = false }: { post: Post; featured?: boolean }) {
  const href = `/blog/${post.slug}`
  return (
    <article
      className={`group border-border ${featured ? `overflow-hidden border-y bg-surface ${post.coverImageUrl ? 'lg:grid lg:grid-cols-[1.2fr_1fr]' : ''}` : 'grid gap-6 border-t py-8 first:border-t-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-start'}`}
    >
      {featured && post.coverImageUrl && (
        <div className="relative block aspect-video overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-green lg:aspect-auto lg:h-full lg:min-h-80 lg:w-full">
          <PostCover
            alt={post.coverImageAlt ?? ''}
            sizes="(max-width: 767px) 100vw, (max-width: 1280px) 50vw, 640px"
            src={post.coverImageUrl}
          />
        </div>
      )}
      <div className={featured ? 'flex flex-1 flex-col p-6 md:p-9 lg:justify-center' : ''}>
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
        <h2 className={`${featured ? 'mt-4 text-h2' : 'mt-3 text-h3'}`}>
          <Link className="transition-colors hover:text-accent-green" href={href}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-4 leading-7 text-text-secondary">{post.excerpt}</p>}
        {featured && (
          <div className="mt-7">
            <Link
              className="inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
              href={href}
            >
              Read article <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
      {!featured && (
        <Link
          className="inline-flex items-center gap-2 font-medium hover:text-accent-green"
          href={href}
        >
          Read <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      )}
    </article>
  )
}
