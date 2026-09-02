'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  variant?: 'default' | 'filled'
  error?: boolean
}

const variantStyles = {
  default:
    'bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
  filled:
    'bg-[var(--surface-subtle)] border border-transparent rounded-[var(--radius-md)] focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
}

const errorVariantStyles = {
  default:
    'border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]',
  filled:
    'border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]',
}

const disabledStyles =
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-subtle)]'
const readOnlyStyles = 'read-only:bg-[var(--surface-subtle)] read-only:cursor-default'

export function Textarea({
  variant = 'default',
  error = false,
  className,
  disabled,
  readOnly,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextareaProps) {
  const isInvalid = error || ariaInvalid === true

  return (
    <textarea
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid || undefined}
      className={cn(
        'w-full px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--tertiary)] transition-[border-color,box-shadow] duration-[var(--transition-fast)] outline-none resize-y',
        variantStyles[variant],
        isInvalid && errorVariantStyles[variant],
        disabled && disabledStyles,
        readOnly && readOnlyStyles,
        className
      )}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  )
}
