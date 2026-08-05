import fs from 'fs'
import path from 'path'
import type { BlogPost, Project } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ─── Generic Helpers ──────────────────────────────────────────────────────────

/**
 * Reads all MDX file slugs from a content subdirectory.
 *
 * @param contentType - Subdirectory name ('blog' | 'projects')
 * @returns Array of slug strings without file extension
 */
export function getContentSlugs(contentType: 'blog' | 'projects'): string[] {
  const dir = path.join(CONTENT_DIR, contentType)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => file.replace(/\.(md|mdx)$/, ''))
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

/**
 * Returns metadata for all published blog posts, sorted by date (newest first).
 * Frontmatter is parsed at build time via next-mdx-remote or similar.
 *
 * NOTE: Full frontmatter parsing implementation depends on chosen MDX strategy.
 * This provides the interface contract — implementation added in Phase 2 of blog build.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getContentSlugs('blog')
  // Frontmatter resolution will be implemented when blog phase begins
  return slugs.map((slug) => ({
    slug,
    title: slug,
    description: '',
    date: new Date().toISOString(),
    tags: [],
    published: false,
    featured: false,
  }))
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Returns metadata for all projects, sorted by date (newest first).
 * Full implementation will integrate with data/projects or MDX frontmatter.
 */
export async function getAllProjects(): Promise<Project[]> {
  const slugs = getContentSlugs('projects')
  return slugs.map((slug) => ({
    id: slug,
    title: slug,
    description: '',
    tags: [],
    href: `/projects/${slug}`,
    featured: false,
    status: 'completed' as const,
    date: new Date().toISOString(),
  }))
}
