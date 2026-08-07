import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const skeletonVariants = cva('animate-pulse', {
  variants: {
    variant: {
      text: 'h-4 w-full rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
})

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

function Skeleton({ className, variant, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        ...style,
      }}
      {...props}
    />
  )
}

export { Skeleton }




