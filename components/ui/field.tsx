'use client'

import { type ReactNode, createContext, useContext, useId } from 'react'
import { cn } from '@/lib/utils'

export interface FieldContextValue {
  errorId: string
  descriptionId: string
  helperId: string
  hasError: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useFieldContext() {
  const ctx = useContext(FieldContext)
  if (!ctx) {
    return { errorId: '', descriptionId: '', helperId: '', hasError: false }
  }
  return ctx
}

export interface FieldRootProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children: ReactNode
  error?: string
}

function FieldRoot({ orientation = 'vertical', className, children, error }: FieldRootProps) {
  const errorId = useId()
  const descriptionId = useId()
  const helperId = useId()
  const hasError = Boolean(error)

  return (
    <FieldContext.Provider value={{ errorId, descriptionId, helperId, hasError }}>
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex flex-row items-center gap-4' : 'flex flex-col gap-2',
          className
        )}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

export interface FieldLabelProps {
  className?: string
  children: ReactNode
  htmlFor?: string
}

function FieldLabel({ className, children, htmlFor }: FieldLabelProps) {
  const { errorId, hasError } = useFieldContext()

  return (
    <label
      className={cn('text-sm font-medium text-[var(--foreground)]', className)}
      htmlFor={htmlFor}
      id={hasError ? errorId : undefined}
    >
      {children}
    </label>
  )
}

export interface FieldDescriptionProps {
  className?: string
  children: ReactNode
}

function FieldDescription({ className, children }: FieldDescriptionProps) {
  const { descriptionId } = useFieldContext()

  return (
    <p className={cn('text-xs text-[var(--muted-foreground)]', className)} id={descriptionId}>
      {children}
    </p>
  )
}

export interface FieldHelperProps {
  className?: string
  children: ReactNode
}

function FieldHelper({ className, children }: FieldHelperProps) {
  const { helperId } = useFieldContext()

  return (
    <p className={cn('text-xs text-[var(--muted-foreground)]', className)} id={helperId}>
      {children}
    </p>
  )
}

export interface FieldErrorProps {
  className?: string
  children: ReactNode
}

function FieldError({ className, children }: FieldErrorProps) {
  const { errorId } = useFieldContext()

  return (
    <p
      className={cn('text-xs text-[var(--danger)] flex items-center gap-1', className)}
      id={errorId}
      role="alert"
    >
      {children}
    </p>
  )
}

export {
  FieldRoot as Field,
  FieldLabel,
  FieldDescription,
  FieldHelper,
  FieldError,
  useFieldContext,
}
