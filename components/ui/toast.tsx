'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  Info,
  X,
  XCircle,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import * as React from 'react'

const toastVariants = cva(
  cn(
    'relative flex w-full max-w-sm rounded-lg border p-4 shadow-lg',
    'transition-[opacity,transform] duration-[var(--transition-fast)]'
  ),
  {
    variants: {
      variant: {
        default:
          'bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]',
        success:
          'bg-[var(--success)] text-[var(--success-foreground)] border-transparent',
        warning:
          'bg-[var(--warning)] text-[var(--warning-foreground)] border-transparent',
        destructive:
          'bg-[var(--danger)] text-[var(--danger-foreground)] border-transparent',
        info: 'bg-[var(--info)] text-[var(--info-foreground)] border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  className?: string
}

const variantIcons: Record<string, LucideIcon> = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
}

export function Toast({
  variant,
  title,
  description,
  action,
  onClose,
  className,
}: ToastProps) {
  const Icon = variant ? variantIcons[variant] : null

  React.useEffect(() => {
    if (!onClose) return
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      aria-live="polite"
      className={cn(toastVariants({ variant }), className)}
      role="status"
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <div className="ml-3 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      {onClose && (
        <button
          aria-label="Close notification"
          className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
          type="button"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{
    id: string
    variant?: ToastProps['variant']
    title?: string
    description?: string
    action?: React.ReactNode
  }>
  onDismiss: (id: string) => void
  className?: string
}

export function ToastContainer({
  toasts,
  onDismiss,
  className,
}: ToastContainerProps) {
  return (
    <div
      aria-atomic="false"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-3',
        className
      )}
    >
      {toasts.map((toast) => (
        <Toast
          action={toast.action}
          description={toast.description}
          key={toast.id}
          title={toast.title}
          variant={toast.variant}
          onClose={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  )
}




