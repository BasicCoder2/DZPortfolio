import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PanelProps {
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Panel({ header, children, footer, className }: PanelProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface shadow-card', className)}>
      {header && (
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          {header}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="border-t border-border px-6 py-4">{footer}</div>
      )}
    </div>
  )
}
