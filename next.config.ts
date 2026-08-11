import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Strict mode for React 19
  reactStrictMode: true,
}

export default nextConfig
