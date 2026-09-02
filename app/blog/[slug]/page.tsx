import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Section } from '@/components/layout'
import { blogPosts, getBlogPost } from '@/data/blog'
import { getBlogContent } from '@/data/blog-content'
import { constructMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  return constructMetadata({
    title: post?.title ?? 'Blog',
    description: post?.description,
    path: `/blog/${slug}`,
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  const Content = getBlogContent(slug)

  if (!post || !Content) notFound()

  return (
    <Section>
      <Container size="prose">
        <Link className="text-sm text-text-secondary hover:text-accent-green" href="/blog">
          ← Back to blog
        </Link>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
          {post.draft ? 'Draft note' : post.date}
        </p>
        <h1 className="mt-3 text-display-lg">{post.title}</h1>
        <p className="mt-5 text-xl text-text-secondary">{post.description}</p>
        <article className="mt-12 max-w-none space-y-6">
          <Content />
        </article>
      </Container>
    </Section>
  )
}
