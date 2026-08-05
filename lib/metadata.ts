import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/utils'

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
    default: 'Daniel Zimba — Software Engineer',
    template: '%s | Daniel Zimba',
  },

  description:
    'Senior Software Engineer specializing in enterprise systems, scalable architecture, and full-stack development. Building software that matters.',

  keywords: [
    'Daniel Zimba',
    'Software Engineer',
    'Full Stack Developer',
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
    title: 'Daniel Zimba — Software Engineer',
    description:
      'Senior Software Engineer specializing in enterprise systems, scalable architecture, and full-stack development.',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Daniel Zimba — Software Engineer',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Daniel Zimba — Software Engineer',
    description:
      'Senior Software Engineer specializing in enterprise systems, scalable architecture, and full-stack development.',
    images: [defaultOgImage],
    creator: '@danielzimba',
  },

  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-16x16.png',
    apple: '/favicons/apple-touch-icon.png',
  },

  manifest: '/favicons/site.webmanifest',
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
  const pageTitle = title ?? 'Daniel Zimba — Software Engineer'
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
