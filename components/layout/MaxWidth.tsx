import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface MaxWidthProps<T extends ElementType> {
  as?: T
}

type Props<T extends ElementType> = MaxWidthProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof MaxWidthProps<T>>

/**
 * A thin wrapper that strictly enforces the global max-width without adding
 * padding or centering. Useful when the parent component manages the padding.
 */
export function MaxWidth<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'div'

  return (
    <Component className={cn('w-full max-w-[1200px] mx-auto', className)} {...props}>
      {children}
    </Component>
  )
}
