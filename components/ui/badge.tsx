import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  cn('inline-flex items-center rounded-md font-medium', 'transition-colors duration-150'),
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
        secondary: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
        outline: 'border border-[var(--border-strong)] text-[var(--foreground)]',
        destructive: 'bg-[var(--danger)] text-[var(--danger-foreground)]',
        success: 'bg-[var(--success)] text-[var(--success-foreground)]',
        warning: 'bg-[var(--warning)] text-[var(--warning-foreground)]',
        info: 'bg-[var(--info)] text-[var(--info-foreground)]',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
