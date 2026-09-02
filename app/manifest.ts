import type { MetadataRoute } from 'next'
import { siteConfig } from '@/data/site'

/**
 * Web app manifest, served at /manifest.webmanifest.
 *
 * Replaces the metadata reference to /favicons/site.webmanifest, which was
 * never created and 404'd on every page load.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#07111f',
    theme_color: '#07111f',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  }
}
