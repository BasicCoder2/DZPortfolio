import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tagVariants = cva(
  'inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-foreground)]',
  {
    variants: {
      tone: {
        default: 'bg-[var(--surface-muted)] text-[var(--muted-foreground)]',
        accent: 'border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)]',
        success: 'border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]',
        warning: 'border-[var(--warning)]/30 bg-[var(--warning)]/10 text-[var(--warning)]',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {}

function Tag({ className, tone, ...props }: TagProps) {
  return <span className={cn(tagVariants({ tone }), className)} {...props} />
}

export { Tag, tagVariants }
