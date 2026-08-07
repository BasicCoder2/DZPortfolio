import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

const emptyStateVariants = cva(
  cn(
    'flex flex-col items-center justify-center text-center'
  ),
  {
    variants: {
      variant: {
        default: 'p-8',
        subtle: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface EmptyStateProps
  extends VariantProps<typeof emptyStateVariants> {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  variant,
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(emptyStateVariants({ variant }), className)}
      role="status"
    >
      {icon && (
        <div className="mb-4 text-[var(--muted-foreground)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-[var(--foreground)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-[var(--muted-foreground)] max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}




