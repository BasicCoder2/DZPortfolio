import { AlertCircle } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export type ErrorMessageProps = ComponentPropsWithoutRef<'p'>

export function ErrorMessage({ ...props }: ErrorMessageProps) {
  return (
    <p
      className={cn('text-xs text-[var(--danger)] flex items-center gap-1', props.className)}
      role="alert"
      {...props}
    >
      <AlertCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {props.children}
    </p>
  )
}




