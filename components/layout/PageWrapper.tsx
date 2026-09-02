import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

interface PageWrapperProps<T extends ElementType> {
  as?: T
  children?: ReactNode
}

type Props<T extends ElementType> = PageWrapperProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PageWrapperProps<T>>

/** Route-level wrapper for consistent vertical rhythm and semantic composition. */
export function PageWrapper<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'div'
  return (
    <Component className={cn('w-full', className)} {...props}>
      {children}
    </Component>
  )
}
