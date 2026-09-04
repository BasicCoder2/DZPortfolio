import { requireAdmin } from '@/lib/auth/admin'
import { AdminPageHeader, AdminSecondaryLink } from '@/components/admin/primitives'
import { PostForm } from '@/components/admin/PostForm'

export default async function NewPostPage() {
  // The layout already gated this route; calling it again costs one cached
  // auth round trip and means the page is safe wherever it ends up mounted.
  await requireAdmin('/admin/blog/new')

  return (
    <>
      <AdminPageHeader
        actions={<AdminSecondaryLink href="/admin/blog">Back to posts</AdminSecondaryLink>}
        description="Saved as a draft until you publish it. Nothing here is visible to visitors."
        eyebrow="Blog"
        title="New post"
      />
      <PostForm post={null} />
    </>
  )
}
