import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

/**
 * Supabase Storage host for `images.remotePatterns`.
 *
 * Derived from the environment rather than hardcoded, so the allowlist names
 * exactly one project — this one — instead of every `*.supabase.co` on the
 * internet. A wildcard here would let anyone route arbitrary images through
 * this site's image optimizer.
 *
 * `pathname` is pinned to the public object route for the content bucket, so
 * even within the correct host only published content images are optimizable.
 *
 * When Supabase is not configured the list is empty, which is correct: there
 * are no remote images to serve yet, and the build should not fail over it.
 */
function supabaseImagePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!url) return []

  try {
    const { hostname, protocol } = new URL(url)
    return [
      {
        protocol: protocol.replace(':', '') as 'http' | 'https',
        hostname,
        pathname: '/storage/v1/object/public/content-images/**',
      },
    ]
  } catch {
    console.warn('[next.config] NEXT_PUBLIC_SUPABASE_URL is not a valid URL; no remote image host configured.')
    return []
  }
}

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Permit development access through this machine's loopback and LAN hosts.
  // Production origin handling is unaffected by this development-only option.
  allowedDevOrigins: ['127.0.0.1', '192.168.21.37'],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseImagePattern(),
  },

  // Strict mode for React 19
  reactStrictMode: true,
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
