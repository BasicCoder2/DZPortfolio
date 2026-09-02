'use client'

import * as RadixLabel from '@radix-ui/react-label'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type LabelVariant = 'default' | 'error'
export type LabelSize = 'sm' | 'md' | 'lg'

export interface LabelProps extends ComponentPropsWithoutRef<typeof RadixLabel.Root> {
  variant?: LabelVariant
  size?: LabelSize
}

const variantStyles: Record<LabelVariant, string> = {
  default: 'text-[var(--foreground)]',
  error: 'text-[var(--danger)]',
}

const sizeStyles: Record<LabelSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const weightStyles = 'font-medium'

export function Label({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <RadixLabel.Root
      className={cn(
        'block leading-none',
        variantStyles[variant],
        sizeStyles[size],
        weightStyles,
        className
      )}
      {...props}
    >
      {children}
    </RadixLabel.Root>
  )
}
