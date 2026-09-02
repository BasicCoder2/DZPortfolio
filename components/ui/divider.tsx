import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const dividerVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {
  label?: React.ReactNode
}

function Divider({ className, orientation = 'horizontal', label, ...props }: DividerProps) {
  if (label) {
    return (
      <div
        aria-orientation={orientation ?? 'horizontal'}
        className={cn('flex items-center gap-4 w-full', className)}
        role="separator"
        {...props}
      >
        <div
          className={cn('flex-1 bg-[var(--border)]', orientation === 'vertical' && 'h-full w-px')}
        />
        {orientation !== 'vertical' && (
          <span className="text-sm text-[var(--muted-foreground)] whitespace-nowrap">{label}</span>
        )}
        <div
          className={cn('flex-1 bg-[var(--border)]', orientation === 'vertical' && 'h-full w-px')}
        />
      </div>
    )
  }

  return (
    <div
      aria-orientation={orientation ?? 'horizontal'}
      className={cn(dividerVariants({ orientation }), 'bg-[var(--border)]', className)}
      role="separator"
      {...props}
    />
  )
}

export { Divider }
