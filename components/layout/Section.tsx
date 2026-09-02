import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef } from 'react'

/**
 * Vertical rhythm. Every section sharing one padding value made the page read
 * as a single undifferentiated list, so density now tracks the section's job:
 * reference material is tight, the centrepieces get room.
 */
const sectionSizes = {
  compact: 'py-16 md:py-20',
  default: 'py-20 md:py-28',
  spacious: 'py-24 md:py-40',
}

/** Plane the section sits on. `surface` lifts it off the page ground. */
const sectionTones = {
  default: '',
  surface: 'bg-surface border-y border-border',
}

interface SectionProps<T extends ElementType> {
  as?: T
  size?: keyof typeof sectionSizes
  tone?: keyof typeof sectionTones
}

type Props<T extends ElementType> = SectionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SectionProps<T>>

export function Section<T extends ElementType = 'section'>({
  as,
  size = 'default',
  tone = 'default',
  className,
  children,
  ...props
}: Props<T>) {
  const Component = as || 'section'

  return (
    <Component
      className={cn('scroll-mt-24', sectionSizes[size], sectionTones[tone], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
