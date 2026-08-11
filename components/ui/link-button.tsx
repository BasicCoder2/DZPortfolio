import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const linkButtonVariants = cva(
  cn(
    'inline-flex items-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'underline-offset-4 hover:underline'
  ),
  {
    variants: {
      variant: {
        default: 'text-[var(--foreground)]',
        primary: 'text-[var(--primary)]',
        secondary: 'text-[var(--secondary)]',
      },
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface LinkButtonProps extends VariantProps<typeof linkButtonVariants> {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

function LinkButton({ href, children, className, variant, size, external = false }: LinkButtonProps) {
  const sharedProps = {
    className: cn(linkButtonVariants({ variant, size }), className),
  }

  if (external) {
    return (
      <a {...sharedProps} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link {...sharedProps} href={href}>
      {children}
    </Link>
  )
}

export { LinkButton, linkButtonVariants }
