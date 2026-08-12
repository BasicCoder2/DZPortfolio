import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'

const components: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="text-display-md" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="mt-12 text-h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 className="mt-8 text-h3" {...props} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="leading-8 text-text-secondary" {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a className="text-accent-green underline decoration-accent-green/40 underline-offset-4 transition-colors hover:text-text-primary" {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="my-6 list-disc space-y-2 pl-6 text-text-secondary" {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="my-6 list-decimal space-y-2 pl-6 text-text-secondary" {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li className="pl-1" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="my-8 border-l-2 border-accent-green pl-5 italic text-text-secondary" {...props} />,
  code: (props: ComponentPropsWithoutRef<'code'>) => <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] text-accent-green" {...props} />,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <pre className="my-8 overflow-x-auto rounded-xl border border-border-subtle bg-surface-muted p-5" {...props} />,
  hr: (props: ComponentPropsWithoutRef<'hr'>) => <hr className="my-10 border-border-subtle" {...props} />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
