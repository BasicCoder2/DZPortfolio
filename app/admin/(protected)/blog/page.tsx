import Link from 'next/link'
import { listAllPosts } from '@/lib/content/admin-queries'
import { deletePostAction, setPostStatusAction } from '@/lib/actions/posts'
import {
  AdminEmptyState,
  AdminList,
  AdminListRow,
  AdminPageHeader,
  AdminPrimaryLink,
  MetaLine,
  StatusPill,
  formatTimestamp,
} from '@/components/admin/primitives'
import { ContentRowActions } from '@/components/admin/ContentRowActions'

/** Blog list. Drafts first, because those are the ones that need work. */
export default async function AdminBlogPage() {
  const posts = await listAllPosts()
  const ordered = [...posts].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'draft' ? -1 : 1
    return b.updatedAt.localeCompare(a.updatedAt)
  })

  return (
    <>
      <AdminPageHeader
        actions={<AdminPrimaryLink href="/admin/blog/new">New post</AdminPrimaryLink>}
        description="Notes and articles published at /blog."
        eyebrow="Content"
        title="Blog"
      />

      {ordered.length === 0 ? (
        <AdminEmptyState
          action={<AdminPrimaryLink href="/admin/blog/new">Write the first post</AdminPrimaryLink>}
          description="Nothing has been written yet. The public blog page shows its empty state until a post is published."
          title="No posts yet"
        />
      ) : (
        <AdminList>
          {ordered.map((post) => (
            <AdminListRow key={post.id}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    className="text-lg font-semibold text-text-primary underline-offset-4 hover:text-accent-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                    href={`/admin/blog/${post.id}/edit`}
                  >
                    {post.title}
                  </Link>
                  <StatusPill status={post.status} />
                </div>

                {post.excerpt !== '' && (
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">{post.excerpt}</p>
                )}

                <MetaLine>
                  <span>/blog/{post.slug}</span>
                  <span>
                    {post.status === 'published'
                      ? `Published ${formatTimestamp(post.publishedAt)}`
                      : `Updated ${formatTimestamp(post.updatedAt)}`}
                  </span>
                  <span>{post.readingTime}</span>
                </MetaLine>
              </div>

              <ContentRowActions
                deleteAction={deletePostAction}
                draftValue="draft"
                field="status"
                id={post.id}
                isLive={post.status === 'published'}
                liveValue="published"
                name={post.title}
                publishLabel="Publish"
                statusAction={setPostStatusAction}
                unpublishLabel="Unpublish"
              />
            </AdminListRow>
          ))}
        </AdminList>
      )}
    </>
  )
}
