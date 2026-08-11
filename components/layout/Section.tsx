import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface SectionProps<T extends ElementType> {
  as?: T
}

type Props<T extends ElementType> = SectionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>

export function Section<T extends ElementType = 'section'>({
  as,
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'section'

  return (
    <Component className={cn('section scroll-mt-24', className)} {...props}>
      {children}
    </Component>
  )
}
