import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const surfaceVariants = cva('rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)]', {
  variants: {
    tone: {
      default: 'bg-[var(--surface-elevated)]',
      muted: 'bg-[var(--surface-muted)]',
      overlay: 'bg-[var(--surface-overlay)] backdrop-blur-xl',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-[var(--shadow-sm)]',
      md: 'shadow-[var(--shadow-md)]',
      lg: 'shadow-[var(--shadow-lg)]',
    },
  },
  defaultVariants: {
    tone: 'default',
    shadow: 'sm',
  },
})

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof surfaceVariants> {}

function Surface({ className, tone, shadow, ...props }: SurfaceProps) {
  return <div className={cn(surfaceVariants({ tone, shadow }), className)} {...props} />
}

export { Surface, surfaceVariants }
