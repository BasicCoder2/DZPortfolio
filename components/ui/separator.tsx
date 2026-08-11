import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return <div aria-hidden="true" className={cn(orientation === 'horizontal' ? 'h-px w-full bg-[var(--divider)]' : 'h-full w-px bg-[var(--divider)]', className)} {...props} />
}

export { Separator }
