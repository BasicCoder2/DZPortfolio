'use client'

import * as RadixSwitch from '@radix-ui/react-switch'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type SwitchVariant = 'default' | 'primary'

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
  'checked'
> {
  variant?: SwitchVariant
  checked?: boolean
  readOnly?: boolean
}

const rootVariantStyles: Record<SwitchVariant, string> = {
  default: cn(
    'bg-[var(--muted)] data-[state=checked]:bg-[var(--foreground)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
  ),
  primary: cn(
    'bg-[var(--border)] data-[state=checked]:bg-[var(--primary)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
  ),
}

const thumbVariantStyles: Record<SwitchVariant, string> = {
  default:
    'bg-[var(--background)] data-[state=checked]:bg-[var(--background)] shadow-[var(--shadow-sm)]',
  primary:
    'bg-[var(--background)] data-[state=checked]:bg-[var(--primary-foreground)] shadow-[var(--shadow-sm)]',
}

const disabledStyles = 'disabled:cursor-not-allowed disabled:opacity-50'

export function Switch({
  variant = 'default',
  readOnly: _readOnly,
  checked,
  disabled,
  className,
  id,
  name,
  required,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SwitchProps) {
  const isInvalid = ariaInvalid === true

  return (
    <RadixSwitch.Root
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid || undefined}
      checked={checked}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-[var(--transition-fast)]',
        'focus-visible:outline-none',
        rootVariantStyles[variant],
        disabled && disabledStyles,
        isInvalid && 'border border-[var(--danger)]',
        className
      )}
      disabled={disabled}
      id={id}
      name={name}
      required={required}
      onCheckedChange={props.onCheckedChange}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          'block h-5 w-5 rounded-full transition-transform duration-[var(--transition-fast)]',
          'data-[state=checked]:translate-x-5',
          thumbVariantStyles[variant]
        )}
      />
    </RadixSwitch.Root>
  )
}
