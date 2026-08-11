import * as React from 'react'
import { Alert } from './alert'
import { Empty } from './empty'
import { Spinner } from './spinner'

export interface FeedbackProps {
  kind?: 'success' | 'warning' | 'danger' | 'info' | 'loading' | 'empty'
  title: string
  description?: string
  action?: React.ReactNode
}

function Feedback({ kind = 'info', title, description, action }: FeedbackProps) {
  if (kind === 'loading') {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-[var(--foreground)]" role="status">
        <Spinner size="md" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description ? <p className="text-sm text-[var(--muted-foreground)]">{description}</p> : null}
        </div>
      </div>
    )
  }

  if (kind === 'empty') {
    return <Empty action={action} description={description} title={title} />
  }

  return <Alert description={description} title={title} variant={kind === 'danger' ? 'destructive' : kind} />
}

export { Feedback }
