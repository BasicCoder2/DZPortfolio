import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: React.ReactNode
}

function Empty({ title, description, action, className, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] p-10 text-center',
        className
      )}
      role="status"
      {...props}
    >
      <h3 className="text-h3 text-[var(--foreground)]">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export { Empty }
