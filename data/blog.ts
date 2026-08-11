import type { BlogPost } from '@/types'

export const blogPosts: BlogPost[] = [
  { slug: 'building-useful-systems', title: 'Building Useful Systems', description: 'A draft note on turning complex requirements into software people can rely on.', date: '2025-01-01', tags: ['Engineering', 'Draft'], published: true, featured: true, readingTime: '3 min read', draft: true },
]

export function getBlogPost(slug: string) { return blogPosts.find((post) => post.slug === slug) }
