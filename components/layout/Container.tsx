import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
  site: 'max-w-[1200px]',
  prose: 'max-w-[720px]',
}

interface ContainerProps<T extends ElementType> {
  as?: T
  size?: keyof typeof containerSizes
}

type Props<T extends ElementType> = ContainerProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>

export function Container<T extends ElementType = 'div'>({
  as,
  size = 'site',
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
