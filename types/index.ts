/**
 * Global TypeScript type definitions for DZPortfolio.
 * All shared interfaces live here. Import via @/types.
 */

// ─── Navigation ───────────────────────────────────────────────────────────────

/** A single navigation link item. */
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

// ─── Social Links ─────────────────────────────────────────────────────────────

/** A social media / external profile link. */
export interface SocialLink {
  name: string
  href: string
  /** Lucide icon name (string key). Component resolves at runtime. */
  icon: string
  ariaLabel: string
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/** Represents a portfolio project entry. */
export interface Project {
  id: string
  slug?: string
  shortTitle?: string
  category?: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  href: string
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured: boolean
  status: 'completed' | 'in-progress' | 'archived'
  date: string // ISO date string
  coverImage?: string
  gallery?: string[]
  year?: string
  role?: string
  caseStudy?: ProjectCaseStudy
}

export interface ProjectCaseStudy {
  overview: string
  problem: string
  role: string
  solution: string
  architecture: string
  decisions: string[]
  challenges: string
  outcome: string
  reflection: string
}

// ─── Experience ───────────────────────────────────────────────────────────────

/** A professional experience entry. */
export interface Experience {
  id: string
  company: string
  companyUrl?: string
  role: string
  period: string
  startDate?: string // ISO date
  endDate?: string // ISO date — undefined if current
  current?: boolean
  location?: string
  locationType?: 'remote' | 'onsite' | 'hybrid'
  highlights: string[]
  technologies?: string[]
}

// ─── Services ─────────────────────────────────────────────────────────────────

/** A service / capability offering (renders as "What I Build"). */
export interface Service {
  id: string
  title: string
  description: string
  /** Lucide icon name */
  icon: string
  highlights: string[]
}

// ─── Technologies ─────────────────────────────────────────────────────────────

export type TechnologyCategory =
  'language' | 'framework' | 'database' | 'cloud' | 'tool' | 'platform'

/** A technology / skill entry. */
export interface Technology {
  name: string
  category: TechnologyCategory
  proficiency: 'expert' | 'advanced' | 'intermediate'
  iconUrl?: string
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

/** Blog post frontmatter metadata. */
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string // ISO date
  tags: string[]
  published: boolean
  featured: boolean
  readingTime?: string
  coverImage?: string
  draft?: boolean
}

export interface Certification {
  title: string
  issuer: string
  issueDate?: string
  credentialUrl?: string
  image?: string
}

// ─── Site Config ──────────────────────────────────────────────────────────────

/** Global site configuration object. */
export interface SiteConfig {
  name: string
  title: string
  description: string
  url: string
  author: {
    name: string
    email: string
    role: string
  }
  keywords: string[]
  ogImage: string
  cvPath: string
}

// ─── Component Utilities ──────────────────────────────────────────────────────

/** Standard children prop shorthand. */
export interface WithChildren {
  children: React.ReactNode
}

/** Standard className prop shorthand. */
export interface WithClassName {
  className?: string
}

/** Combined children + className. */
export type PropsWithChildrenAndClassName = WithChildren & WithClassName
