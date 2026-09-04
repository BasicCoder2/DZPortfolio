import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/content/admin-queries'
import { PostArticle } from '@/components/blog/PostArticle'
import { PreviewBanner } from '@/components/admin/PreviewBanner'

export const metadata: Metadata = {
  title: 'Draft preview',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * Draft preview for a blog post.
 *
 * Lives under `(protected)`, so the layout gate applies, and reads through
 * `admin-queries`, which re-authorizes and uses the cookie-backed client — the
 * only path in the application that can see an unpublished row. There is no
 * token, no shareable preview link and no draft-mode cookie to leak: seeing a
 * draft requires being signed in as the administrator, every time.
 */
export default async function PreviewPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    // Cancels the admin shell's padding so the article is measured in the same
    // column it will occupy on the public site.
    <div className="-mx-6 -my-8 lg:-mx-10 lg:-my-12">
      <PreviewBanner
        backHref={`/admin/blog/${post.id}/edit`}
        status={post.status}
        target={`/blog/${post.slug}`}
      />
      <PostArticle preview post={post} />
    </div>
  )
}
