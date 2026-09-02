import type { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'
import { projects } from '@/data/projects'
import { siteConfig } from '@/data/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/me`, lastModified: new Date() },
    { url: `${siteConfig.url}/projects`, lastModified: new Date() },
    ...projects.map((project) => ({
      url: `${siteConfig.url}${project.href}`,
      lastModified: new Date(project.date),
    })),
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ]
}
