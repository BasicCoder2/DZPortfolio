import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedPost, listPublishedPostSlugs } from '@/lib/content/repositories'
import { PostArticle } from '@/components/blog/PostArticle'
import { constructMetadata } from '@/lib/metadata'

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

/**
 * Prerenders the posts that exist at build time.
 *
 * `dynamicParams` stays at its default of `true`, so a post published after a
 * deploy renders on first request and is cached from then on — publishing must
 * not require a redeploy.
 */
export async function generateStaticParams() {
  const slugs = await listPublishedPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  if (!post) {
    return constructMetadata({ title: 'Not found', noIndex: true, path: `/blog/${slug}` })
  }

  return constructMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? (post.excerpt || undefined),
    path: `/blog/${post.slug}`,
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedPost(slug)

  // A draft, a deleted post and a typo all reach here identically. That is
  // intended: a distinct "this exists but is not published" response would
  // leak the existence of unpublished work.
  if (!post) notFound()

  return <PostArticle post={post} />
}
