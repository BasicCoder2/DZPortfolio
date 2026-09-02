import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils'
import { siteConfig } from '@/data/site'

/** Canonical site URL from environment. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://danielzimba.dev'

/** Default Open Graph image. */
const defaultOgImage = `${siteUrl}/og/og-default.png`

/**
 * Default site-wide metadata configuration.
 * Every page should call `constructMetadata()` and merge page-specific values.
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteConfig.title,
    template: '%s | Daniel Zimba',
  },

  description: siteConfig.description,

  keywords: [
    'Daniel Zimba',
    'Software Developer',
    'Enterprise Systems',
    'Next.js',
    'TypeScript',
    'React',
    'Node.js',
    'System Architecture',
    'Technical Leadership',
  ],

  authors: [{ name: 'Daniel Zimba', url: siteUrl }],

  creator: 'Daniel Zimba',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Daniel Zimba',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [defaultOgImage],
    creator: '@danielzimba',
  },

  // Icons and the web manifest come from the app-directory file conventions
  // (app/icon.svg, app/apple-icon.tsx, app/manifest.ts) so Next emits the link
  // tags itself. Declaring them here pointed at /favicons/*, which was empty.
}

// ─── Metadata Constructor ─────────────────────────────────────────────────────

interface ConstructMetadataOptions {
  title?: string
  description?: string
  image?: string
  path?: string
  noIndex?: boolean
}

/**
 * Constructs page-level metadata by merging page-specific values
 * with the site-wide defaults. Use in every page's generateMetadata().
 *
 * @example
 * export const metadata = constructMetadata({
 *   title: 'Projects',
 *   description: 'View my portfolio of software projects.',
 *   path: '/projects',
 * })
 */
export function constructMetadata({
  title,
  description,
  image,
  path = '/',
  noIndex = false,
}: ConstructMetadataOptions = {}): Metadata {
  const pageTitle = title ?? siteConfig.title
  const pageDescription = description ?? (defaultMetadata.description as string)
  const pageImage = image ?? defaultOgImage
  const canonicalUrl = absoluteUrl(path)

  return {
    ...defaultMetadata,
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  }
}
