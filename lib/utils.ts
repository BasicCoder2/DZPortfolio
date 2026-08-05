import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS classes safely, resolving conflicts via tailwind-merge.
 * Use this for all conditional class composition throughout the project.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-accent-green', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a human-readable format.
 *
 * @param dateString - ISO date string (e.g., '2024-03-15')
 * @param options - Optional Intl.DateTimeFormat options
 * @returns Formatted date string (e.g., 'March 15, 2024')
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Date(dateString).toLocaleDateString('en-US', options)
}

/**
 * Formats a date as a short month + year string.
 *
 * @example formatDateShort('2024-03-15') → 'Mar 2024'
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Calculates an approximate reading time for a given text.
 *
 * @param text - Raw text content
 * @param wordsPerMinute - Reading speed (default: 200 wpm)
 * @returns Reading time string (e.g., '5 min read')
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): string {
  const wordCount = text.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}

/**
 * Slugifies a string into a URL-safe format.
 *
 * @example slugify('Hello World') → 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncates a string to a given length, appending '...' if truncated.
 *
 * @param str - Source string
 * @param maxLength - Maximum character count (default: 160)
 */
export function truncate(str: string, maxLength = 160): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength).trim()}...`
}

/**
 * Returns a URL-safe absolute URL by combining the site base URL with a path.
 *
 * @param path - Relative path (e.g., '/blog/my-post')
 */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
