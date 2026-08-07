import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
  default: 'max-w-[1200px]', // Default site width
}

interface ContainerProps<T extends ElementType> {
  /** The semantic HTML tag to render. Default: 'div' */
  as?: T
  /** Container max-width variant. Default: 'default' */
  size?: keyof typeof containerSizes
}

type Props<T extends ElementType> = ContainerProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>

/**
 * Centered container with responsive horizontal padding and constrained width.
 * Standardizes the main content boundaries across the site.
 */
export function Container<T extends ElementType = 'div'>({
  as,
  size = 'default',
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'div'

  return (
    <Component
      className={cn('w-full mx-auto px-6 md:px-8 lg:px-12', containerSizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
