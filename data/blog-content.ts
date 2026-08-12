import type { ComponentType } from 'react'
import BuildingUsefulSystems from '@/content/blog/building-useful-systems.mdx'

const BLOG_CONTENT: Record<string, ComponentType> = {
  'building-useful-systems': BuildingUsefulSystems,
}

export function getBlogContent(slug: string): ComponentType | undefined {
  return BLOG_CONTENT[slug]
}
