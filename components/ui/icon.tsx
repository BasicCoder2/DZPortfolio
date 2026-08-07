import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconVariants = cva('inline-flex shrink-0', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
  },
  defaultVariants: {
    size: 'md',
    align: 'center',
  },
})

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconVariants> {
  strokeWidth?: number
  decorative?: boolean
  label?: string
  children: React.ReactNode
}

function Icon({
  size,
  strokeWidth = 2,
  align,
  decorative = true,
  label,
  className,
  children,
  ...props
}: IconProps) {
  const child = React.isValidElement(children) ? children : null

  return (
    <span
      aria-hidden={decorative}
      aria-label={decorative ? undefined : label}
      className={cn(iconVariants({ size, align }), className)}
      role={decorative ? 'presentation' : 'img'}
      {...props}
    >
      {child &&
        React.cloneElement(child as React.ReactElement<{ strokeWidth?: number; 'aria-hidden'?: string }>, {
          strokeWidth,
          'aria-hidden': decorative ? 'true' : undefined,
        })}
    </span>
  )
}

export { Icon }




