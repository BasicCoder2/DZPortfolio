import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

interface SectionProps<T extends ElementType> {
  /** The semantic HTML tag to render. Default: 'section' */
  as?: T
}

type Props<T extends ElementType> = SectionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>

/**
 * Vertical rhythm wrapper.
 * Standardizes the vertical spacing (padding) between distinct sections
 * of a page using the `.section` utility from globals.css.
 */
export function Section<T extends ElementType = 'section'>({
  as,
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'section'

  return (
    <Component className={cn('section', className)} {...props}>
      {children}
    </Component>
  )
}
