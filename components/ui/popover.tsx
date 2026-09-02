'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const popoverVariants = cva(
  cn(
    'z-50 rounded-lg border shadow-floating',
    'transition-[opacity,transform] duration-[var(--transition-fast)]'
  ),
  {
    variants: {
      variant: {
        default: 'bg-[var(--popover)] text-[var(--popover-foreground)] border-[var(--border)]',
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface PopoverProps extends VariantProps<typeof popoverVariants> {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  contentClassName?: string
}

export function Popover({
  children,
  content,
  variant,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  open,
  onOpenChange,
  contentClassName,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          className={cn(popoverVariants({ variant }), contentClassName)}
          side={side}
          sideOffset={sideOffset}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
