import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  footer?: React.ReactNode
}

function Panel({ title, footer, children, className, ...props }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]',
        className
      )}
      {...props}
    >
      {title ? <div className="border-b border-[var(--border)] px-6 py-4">{title}</div> : null}
      <div className="px-6 py-6">{children}</div>
      {footer ? <div className="border-t border-[var(--border)] px-6 py-4">{footer}</div> : null}
    </section>
  )
}

export { Panel }
