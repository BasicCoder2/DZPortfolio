import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface PageProps<T extends ElementType> {
  as?: T
  size?: 'default' | 'narrow' | 'full'
}

type Props<T extends ElementType> = PageProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof PageProps<T>>

export function Page<T extends ElementType = 'main'>({
  as,
  size = 'default',
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'main'

  const sizeClasses = {
    default: 'max-w-site mx-auto px-6 md:px-8 lg:px-12',
    narrow: 'max-w-prose mx-auto px-6 md:px-8 lg:px-12',
    full: 'w-full',
  }

  return (
    <Component className={cn(sizeClasses[size], className)} {...props}>
      {children}
    </Component>
  )
}
