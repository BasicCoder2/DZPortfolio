import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)]',
  {
    variants: {
      interactive: {
        true: 'cursor-pointer transition-colors duration-[var(--transition-fast)] hover:bg-[var(--surface-muted)]',
        false: '',
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
)

export interface ChipProps extends React.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof chipVariants> {}

function Chip({ className, interactive = false, ...props }: ChipProps) {
  if (interactive) {
    return <button className={cn(chipVariants({ interactive }), className)} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} />
  }
  return <div className={cn(chipVariants({ interactive }), className)} {...(props as React.HTMLAttributes<HTMLDivElement>)} />
}

export { Chip, chipVariants }
