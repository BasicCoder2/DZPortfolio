'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0'
  ),
  {
    variants: {
      variant: {
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:brightness-110',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm hover:brightness-110',
        outline: 'border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--surface-subtle)] hover:border-[var(--border)]',
        ghost: 'text-[var(--foreground)] hover:bg-[var(--surface-subtle)]',
        link: 'text-[var(--primary)] underline-offset-4 hover:underline',
        destructive: 'bg-[var(--danger)] text-[var(--danger-foreground)] shadow-sm hover:brightness-110',
        success: 'bg-[var(--success)] text-[var(--success-foreground)] shadow-sm hover:brightness-110',
      },
      size: {
        icon: 'h-9 w-9',
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, fullWidth, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        aria-busy={loading}
        className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }




