import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ShellProps {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Shell({ header, children, footer, className }: ShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      {header && <header className="flex-shrink-0">{header}</header>}
      <div className="flex-1">{children}</div>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  )
}
