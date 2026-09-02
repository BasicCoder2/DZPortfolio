'use client'

import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  variant?: 'default' | 'filled' | 'underlined'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: boolean
}

const variantStyles = {
  default:
    'bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
  filled:
    'bg-[var(--surface-subtle)] border border-transparent rounded-[var(--radius-md)] focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
  underlined:
    'bg-transparent border-0 border-b border-[var(--border)] rounded-none shadow-none focus-visible:border-[var(--ring)] focus-visible:ring-0 focus-visible:ring-offset-0',
}

const errorVariantStyles = {
  default:
    'border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]',
  filled:
    'border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]',
  underlined: 'border-b-[var(--danger)] focus-visible:border-[var(--danger)]',
}

const disabledStyles =
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--surface-subtle)]'
const readOnlyStyles = 'read-only:bg-[var(--surface-subtle)] read-only:cursor-default'

export function Input({
  variant = 'default',
  leftIcon,
  rightIcon,
  error = false,
  className,
  disabled,
  readOnly,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: InputProps) {
  const isInvalid = error || ariaInvalid === true

  return (
    <div className="relative w-full">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        aria-describedby={ariaDescribedBy}
        aria-invalid={isInvalid || undefined}
        className={cn(
          'w-full px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--tertiary)] transition-[border-color,box-shadow] duration-[var(--transition-fast)] outline-none',
          variantStyles[variant],
          isInvalid && errorVariantStyles[variant],
          disabled && disabledStyles,
          readOnly && readOnlyStyles,
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        disabled={disabled}
        id={id}
        readOnly={readOnly}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none">
          {rightIcon}
        </span>
      )}
    </div>
  )
}
