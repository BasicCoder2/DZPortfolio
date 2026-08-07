'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tooltipVariants = cva(
  cn(
      'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md',
    'transition-[opacity,transform] duration-[var(--transition-fast)]'
  ),
  {
    variants: {
      variant: {
        default:
          'bg-[var(--foreground)] text-[var(--background)]',
        primary:
          'bg-[var(--primary)] text-[var(--primary-foreground)]',
        destructive:
          'bg-[var(--danger)] text-[var(--danger-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TooltipProps
  extends VariantProps<typeof tooltipVariants> {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export function Tooltip({
  content,
  children,
  variant,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            align={align}
            className={cn(tooltipVariants({ variant }), className)}
            side={side}
            sideOffset={sideOffset}
          >
            {content}
            <TooltipPrimitive.Arrow
              className="fill-current"
              height={5}
              width={10}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}




