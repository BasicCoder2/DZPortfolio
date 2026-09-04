import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/content/admin-queries'
import {
  AdminPageHeader,
  AdminSecondaryLink,
  StatusPill,
  formatTimestamp,
} from '@/components/admin/primitives'
import { PostForm } from '@/components/admin/PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostById(id)

  if (!post) notFound()

  return (
    <>
      <AdminPageHeader
        actions={<AdminSecondaryLink href="/admin/blog">Back to posts</AdminSecondaryLink>}
        description={`Last updated ${formatTimestamp(post.updatedAt)}.`}
        eyebrow="Blog"
        title={post.title}
      />

      <div className="mb-8 flex items-center gap-3">
        <StatusPill status={post.status} />
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-text-tertiary">
          /blog/{post.slug}
        </span>
      </div>

      <PostForm post={post} />
    </>
  )
}
