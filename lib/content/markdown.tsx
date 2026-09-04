import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Link from 'next/link'
import ReactMarkdown, { defaultUrlTransform, type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

/**
 * Renders administrator-authored Markdown.
 *
 * ## Why this is safe
 *
 * Content here is written by the site owner, but it still arrives from a
 * database over the network, so it is treated as untrusted:
 *
 * - **No `rehype-raw`.** Without it, react-markdown never parses embedded HTML
 *   into elements — `<script>alert(1)</script>` in the source comes out as
 *   visible text. There is no `dangerouslySetInnerHTML` anywhere in this
 *   render path. Adding `rehype-raw` would undo the entire guarantee, so
 *   don't.
 * - **URLs are filtered.** `safeUrlTransform` runs react-markdown's own
 *   allowlist (http, https, mailto, tel, relative, and `#` fragments) and
 *   drops anything else, which is what stops `[click](javascript:...)` and
 *   `data:text/html` payloads in links and image sources.
 * - **External links are rel-guarded.** `noopener noreferrer` on anything
 *   leaving the site.
 *
 * ## Heading hierarchy
 *
 * The page owns the `<h1>`; the article body starts at `<h2>`. `headingOffset`
 * shifts every heading down by one level so an author writing `# Section` in
 * the editor cannot produce a second `<h1>` on the page. This is what fixes
 * the duplicate-H1 the old MDX article shipped with.
 */

/** Extra schemes are not merely unstyled — they are removed. */
function safeUrlTransform(url: string): string {
  const transformed = defaultUrlTransform(url)
  return transformed === '' ? '' : transformed
}

function isExternal(href: string | undefined): boolean {
  return typeof href === 'string' && /^https?:\/\//i.test(href)
}

const HEADING_CLASSES = ['text-h2', 'text-h3', 'text-h4', 'text-h5', 'text-h5', 'text-h5'] as const

function heading(level: 1 | 2 | 3 | 4 | 5 | 6, offset: number) {
  const shifted = Math.min(6, level + offset) as 1 | 2 | 3 | 4 | 5 | 6
  const Tag = `h${shifted}` as const
  const className = HEADING_CLASSES[shifted - 1] ?? 'text-h5'

  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    return <Tag className={cn('mt-12 first:mt-0 scroll-mt-28', className)}>{children}</Tag>
  }
}

function buildComponents(headingOffset: number): Components {
  return {
    h1: heading(1, headingOffset),
    h2: heading(2, headingOffset),
    h3: heading(3, headingOffset),
    h4: heading(4, headingOffset),
    h5: heading(5, headingOffset),
    h6: heading(6, headingOffset),

    p: ({ children }) => <p className="mt-5 text-lg leading-8 text-text-secondary">{children}</p>,

    a: ({ href, children }) => {
      const target = typeof href === 'string' ? href : ''
      if (target === '') return <>{children}</>

      if (isExternal(target)) {
        return (
          <a
            className="border-b border-border-strong pb-0.5 font-medium text-text-primary hover:border-accent-green hover:text-accent-green"
            href={target}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          className="border-b border-border-strong pb-0.5 font-medium text-text-primary hover:border-accent-green hover:text-accent-green"
          href={target}
        >
          {children}
        </Link>
      )
    },

    ul: ({ children }) => (
      <ul className="mt-5 space-y-2 text-lg leading-8 text-text-secondary">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg leading-8 text-text-secondary">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="marker:text-accent-green">{children}</li>,

    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-2 border-accent-green/50 pl-5 text-lg italic leading-8 text-text-secondary">
        {children}
      </blockquote>
    ),

    hr: () => <hr className="mt-12 border-border" />,

    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),

    code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      // react-markdown marks fenced blocks with a `language-*` class; inline
      // code has none. Fenced code is wrapped by `pre` below.
      const isBlock = typeof className === 'string' && className.startsWith('language-')
      if (isBlock) {
        return (
          <code className={cn('font-mono text-sm leading-7', className)} {...props}>
            {children}
          </code>
        )
      }
      return (
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-text-primary">
          {children}
        </code>
      )
    },

    pre: ({ children }) => (
      <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-surface p-5">
        {children}
      </pre>
    ),

    // GFM tables can be wider than the prose column; the wrapper scrolls
    // rather than letting the page scroll sideways.
    table: ({ children }) => (
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-border-strong pb-2 pr-6 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-border py-3 pr-6 text-text-secondary">{children}</td>
    ),

    // An article body can contain any number of images at any dimensions,
    // none of them known at build time. next/image needs either an intrinsic
    // size or `fill` plus a sized parent, and neither exists inside arbitrary
    // prose — so this stays a plain <img>, lazily loaded so a long article does
    // not fetch every figure at once.
    img: ({ src, alt }) => {
      const source = typeof src === 'string' ? src : ''
      if (source === '') return null
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={alt ?? ''}
          className="mt-8 w-full rounded-md border border-border"
          decoding="async"
          loading="lazy"
          src={source}
        />
      )
    },
  }
}

export interface MarkdownProps {
  children: string
  className?: string
  /**
   * How far to push headings down. Defaults to 1, so `#` renders as `<h2>`
   * beneath the page's own `<h1>`.
   */
  headingOffset?: number
}

export function Markdown({ children, className, headingOffset = 1 }: MarkdownProps) {
  if (children.trim() === '') return null

  return (
    <div className={cn('max-w-none', className)}>
      <ReactMarkdown
        components={buildComponents(headingOffset)}
        remarkPlugins={[remarkGfm]}
        urlTransform={safeUrlTransform}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

/**
 * Approximate reading time for a Markdown source string.
 *
 * Strips fences, links and syntax first so a code-heavy post is not credited
 * with a twenty-minute read because of its punctuation.
 */
export function markdownReadingTime(source: string, wordsPerMinute = 200): string {
  const text = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ')

  const words = text.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`
}

/**
 * First N characters of the prose, used when an operator has not written an
 * excerpt yet. Never used for published content — the schema requires an
 * explicit excerpt before publish.
 */
export function markdownExcerpt(source: string, maxLength = 200): string {
  const text = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/[`*_>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}
