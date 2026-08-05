import type { NavItem } from '@/types'

/**
 * Primary navigation items.
 * Labels are display strings; hrefs are anchor links for single-page scroll
 * or route paths for multi-page navigation.
 */
export const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'What I Build', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Mobile navigation items — same as primary nav.
 * Kept separate to allow independent ordering or additions.
 */
export const mobileNavItems: NavItem[] = [...navItems]
