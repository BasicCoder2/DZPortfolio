import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type HelperTextProps = ComponentPropsWithoutRef<'p'>

export function HelperText({ ...props }: HelperTextProps) {
  return <p className={cn('text-xs text-[var(--muted-foreground)]', props.className)} {...props} />
}
