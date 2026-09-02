'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, XCircle, X, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const alertVariants = cva(
  cn(
    'relative flex w-full rounded-lg border p-4',
    'transition-colors duration-[var(--transition-fast)]'
  ),
  {
    variants: {
      variant: {
        default: 'bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]',
        destructive: 'bg-[var(--danger)] text-[var(--danger-foreground)] border-transparent',
        success: 'bg-[var(--success)] text-[var(--success-foreground)] border-transparent',
        warning: 'bg-[var(--warning)] text-[var(--warning-foreground)] border-transparent',
        info: 'bg-[var(--info)] text-[var(--info-foreground)] border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string
  description?: string
  icon?: ReactNode
  onDismiss?: () => void
  className?: string
}

const variantIcons: Record<string, LucideIcon> = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
}

export function Alert({ variant, title, description, icon, onDismiss, className }: AlertProps) {
  const Icon = variant ? variantIcons[variant] : null
  const displayIcon = icon ?? (Icon ? <Icon className="h-5 w-5 flex-shrink-0" /> : null)

  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      {displayIcon && <span className="mr-3 flex-shrink-0">{displayIcon}</span>}
      <div className="flex-1">
        {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      {onDismiss && (
        <button
          aria-label="Dismiss alert"
          className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          type="button"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
