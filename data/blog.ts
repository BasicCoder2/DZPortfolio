/**
 * SUPERSEDED — no longer read by the application.
 *
 * Blog posts now live in the Supabase `posts` table and are edited at
 * `/admin/blog`. This file is kept only as the pre-migration record; its
 * frozen contents were copied into `scripts/legacy-content.json`, which is
 * what `pnpm content:import` actually reads.
 *
 * Deleting it is a separate, reviewable change, to be made once the
 * database has been populated and parity confirmed on the live site. Until
 * then it is the only reference for what the site used to say.
 */
import type { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  {
    slug: 'building-useful-systems',
    title: 'Building Useful Systems',
    description: 'A draft note on turning complex requirements into software people can rely on.',
    date: '2025-01-01',
    tags: ['Engineering', 'Draft'],
    published: true,
    featured: true,
    readingTime: '3 min read',
    draft: true,
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
