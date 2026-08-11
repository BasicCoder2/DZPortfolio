import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { blogPosts } from '@/data/blog'
import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({ title: 'Blog', description: 'Engineering notes and working ideas from Daniel Zimba.', path: '/blog' })

export default function BlogPage() { return <Section><Container><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-green">Notes</p><h1 className="mt-3 text-display-lg">Blog</h1><p className="mt-5 text-lg text-text-secondary">Working notes on software, systems, and the decisions behind them.</p></div><div className="mt-16 grid gap-5 md:grid-cols-2">{blogPosts.map((post) => <article className="rounded-xl border border-border bg-surface p-6" key={post.slug}><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">{post.draft ? 'Draft note' : post.date}</p><h2 className="mt-3 text-h3">{post.title}</h2><p className="mt-3 text-text-secondary">{post.description}</p><p className="mt-4 text-sm text-text-tertiary">{post.readingTime}</p><Link className="mt-6 inline-flex font-medium hover:text-accent-green" href={`/blog/${post.slug}`}>Read note →</Link></article>)}</div></Container></Section> }
