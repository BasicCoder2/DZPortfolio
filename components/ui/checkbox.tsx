'use client'

import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type CheckboxVariant = 'default' | 'primary'

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
  'checked'
> {
  variant?: CheckboxVariant
  checked?: boolean | 'indeterminate'
  error?: boolean
  readOnly?: boolean
}

const rootVariantStyles: Record<CheckboxVariant, string> = {
  default: cn(
    'border-[var(--border)] data-[state=checked]:bg-[var(--foreground)] data-[state=checked]:border-[var(--foreground)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
  ),
  primary: cn(
    'border-[var(--primary)] data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]',
    'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'
  ),
}

const indicatorColors: Record<CheckboxVariant, string> = {
  default: 'text-[var(--background)]',
  primary: 'text-[var(--primary-foreground)]',
}

const errorStyles =
  'border-[var(--danger)] data-[state=checked]:bg-[var(--danger)] data-[state=checked]:border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]'

export function Checkbox({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  checked,
  className,
  disabled,
  error = false,
  id,
  name,
  required,
  variant = 'default',
  readOnly: _readOnly,
  ...props
}: CheckboxProps) {
  const isInvalid = error || ariaInvalid === true
  const isIndeterminate = checked === 'indeterminate'

  return (
    <RadixCheckbox.Root
      aria-describedby={ariaDescribedBy}
      aria-invalid={isInvalid || undefined}
      checked={checked}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border transition-colors duration-[var(--transition-fast)]',
        'focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        rootVariantStyles[variant],
        isInvalid && errorStyles,
        className
      )}
      disabled={disabled}
      id={id}
      name={name}
      required={required}
      onCheckedChange={props.onCheckedChange}
      {...props}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
        {isIndeterminate ? (
          <Minus className={cn('h-3 w-3', indicatorColors[variant])} />
        ) : (
          <Check className={cn('h-3 w-3', indicatorColors[variant])} />
        )}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}
