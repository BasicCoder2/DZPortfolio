/**
 * SUPERSEDED — no longer read by the application.
 *
 * Article bodies are Markdown columns in the `posts` table, rendered by
 * `lib/content/markdown.tsx`. The MDX pipeline this file depends on is no
 * longer part of any render path.
 *
 * Kept, with `content/blog/building-useful-systems.mdx`, until the imported
 * post has been finished and published from `/admin/blog`. Removing both is
 * a separate, reviewable change.
 */
import type { ComponentType } from 'react'
import BuildingUsefulSystems from '@/content/blog/building-useful-systems.mdx'

const BLOG_CONTENT: Record<string, ComponentType> = {
  'building-useful-systems': BuildingUsefulSystems,
}

export function getBlogContent(slug: string): ComponentType | undefined {
  return BLOG_CONTENT[slug]
}
