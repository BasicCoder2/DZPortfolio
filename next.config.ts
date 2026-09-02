import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Permit development access through this machine's loopback and LAN hosts.
  // Production origin handling is unaffected by this development-only option.
  allowedDevOrigins: ['127.0.0.1', '192.168.21.37'],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Strict mode for React 19
  reactStrictMode: true,
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
