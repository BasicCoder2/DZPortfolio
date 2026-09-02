'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressIndicatorVariants = cva('h-full w-full rounded-full transition-all duration-150', {
  variants: {
    variant: {
      default: 'bg-[var(--primary)]',
      success: 'bg-[var(--success)]',
      warning: 'bg-[var(--warning)]',
      destructive: 'bg-[var(--danger)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ProgressProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressIndicatorVariants> {
  indicatorClassName?: string
}

function Progress({ className, value, variant, indicatorClassName, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]',
        className
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(progressIndicatorVariants({ variant }), indicatorClassName)}
        style={{ transform: `translateX(-${100 - ((value ?? 0) as number)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
