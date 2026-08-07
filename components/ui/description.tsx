import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type DescriptionProps = ComponentPropsWithoutRef<'p'>

export function Description({ ...props }: DescriptionProps) {
  return (
    <p
      className={cn('text-xs text-[var(--muted-foreground)]', props.className)}
      {...props}
    />
  )
}




