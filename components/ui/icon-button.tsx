import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  cn(
    'inline-flex items-center justify-center rounded-[var(--radius-md)] border border-transparent transition-all duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        default:
          'bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-muted)]',
        primary:
          'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] hover:brightness-110',
        ghost: 'bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]',
        outline:
          'border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)]',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-9 w-9',
        lg: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonVariants> {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(iconButtonVariants({ variant, size }), className)}
      ref={ref}
      type="button"
      {...props}
    />
  )
)

IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
