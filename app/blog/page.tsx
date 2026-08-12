import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Section } from '@/components/layout'
import { blogPosts } from '@/data/blog'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
  title: 'Blog',
  description: 'Engineering notes and working ideas from Daniel Zimba.',
  path: '/blog',
})

export default function BlogPage() {
  return (
    <Section>
      <Container size="prose">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">Notes</p>
          <h1 className="mt-3 text-display-lg">Blog</h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            Working notes on software, systems, and the decisions behind them.
          </p>
        </header>
        <div className="mt-16 divide-y divide-border border-y border-border">
          {blogPosts.map((post) => (
            <article className="py-8" key={post.slug}>
              <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
                <span>{post.draft ? 'Draft note' : post.date}</span>
                <span className="text-text-tertiary">{post.readingTime}</span>
              </div>
              <h2 className="mt-4 text-h3">{post.title}</h2>
              <p className="mt-3 text-lg leading-8 text-text-secondary">{post.description}</p>
              <Link
                className="mt-6 inline-flex items-center gap-2 border-b border-border-strong pb-2 font-medium hover:border-accent-green hover:text-accent-green"
                href={`/blog/${post.slug}`}
              >
                Read note <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
