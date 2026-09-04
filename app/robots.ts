import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/env'

/**
 * Disallowing `/admin` here is housekeeping, not security — a robots file is
 * a request, and the only thing keeping an unauthorized visitor out of the
 * admin area is the authorization check on every page and mutation. It stops
 * the login form turning up in search results, which is worth doing anyway.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
