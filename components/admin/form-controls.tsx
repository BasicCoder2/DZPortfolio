'use client'

import { useId } from 'react'
import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'
import { firstError, type FormState } from '@/lib/actions/state'

/**
 * Form controls for the admin area.
 *
 * Every field wires its own accessibility: a real `<label htmlFor>`, an
 * `aria-describedby` pointing at the hint and the error, and `aria-invalid`
 * when something is wrong. That is why these exist instead of raw inputs —
 * getting it right once here beats getting it right sixty times across five
 * forms, and errors that are only red are errors a screen reader never
 * announces.
 */

const controlBase = cn(
  'w-full rounded-md border bg-[var(--background)] px-3 py-2 text-sm text-text-primary',
  'placeholder:text-[var(--tertiary)] transition-[border-color,box-shadow] outline-none',
  'focus-visible:border-[var(--ring)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

function controlClasses(invalid: boolean): string {
  return cn(
    controlBase,
    invalid ? 'border-[var(--danger)] focus-visible:border-[var(--danger)]' : 'border-border'
  )
}

interface FieldFrameProps {
  label: string
  htmlFor: string
  hint?: string
  hintId?: string
  error?: string
  errorId?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

function FieldFrame({
  label,
  htmlFor,
  hint,
  hintId,
  error,
  errorId,
  required,
  children,
  className,
}: FieldFrameProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-sm font-medium text-text-primary" htmlFor={htmlFor}>
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-[var(--danger)]">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-text-tertiary" id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs text-[var(--danger)]" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(
  hint: string | undefined,
  error: string | undefined,
  ids: {
    hintId: string
    errorId: string
  }
): string | undefined {
  const parts = [hint ? ids.hintId : null, error ? ids.errorId : null].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : undefined
}

// --- Text ------------------------------------------------------------------

export interface TextFieldProps {
  name: string
  label: string
  defaultValue?: string | null
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'url' | 'date' | 'number'
  inputMode?: 'text' | 'decimal' | 'numeric'
  step?: string
  min?: string
  max?: string
  autoComplete?: string
  className?: string
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  error,
  required,
  type = 'text',
  inputMode,
  step,
  min,
  max,
  autoComplete,
  className,
  disabled,
  value,
  onChange,
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <FieldFrame
      className={className}
      error={error}
      errorId={errorId}
      hint={hint}
      hintId={hintId}
      htmlFor={id}
      label={label}
      required={required}
    >
      <input
        aria-describedby={describedBy(hint, error, { hintId, errorId })}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        className={controlClasses(Boolean(error))}
        defaultValue={onChange ? undefined : (defaultValue ?? '')}
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        max={max}
        min={min}
        name={name}
        placeholder={placeholder}
        step={step}
        type={type}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </FieldFrame>
  )
}

// --- Textarea ---------------------------------------------------------------

export function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  error,
  required,
  rows = 4,
  className,
}: {
  name: string
  label: string
  defaultValue?: string | null
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  rows?: number
  className?: string
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <FieldFrame
      className={className}
      error={error}
      errorId={errorId}
      hint={hint}
      hintId={hintId}
      htmlFor={id}
      label={label}
      required={required}
    >
      <textarea
        aria-describedby={describedBy(hint, error, { hintId, errorId })}
        aria-invalid={error ? true : undefined}
        className={cn(controlClasses(Boolean(error)), 'resize-y')}
        defaultValue={defaultValue ?? ''}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
    </FieldFrame>
  )
}

// --- Select -----------------------------------------------------------------

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  hint,
  error,
  className,
  value,
  onChange,
}: {
  name: string
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  defaultValue?: string
  hint?: string
  error?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <FieldFrame
      className={className}
      error={error}
      errorId={errorId}
      hint={hint}
      hintId={hintId}
      htmlFor={id}
      label={label}
    >
      <select
        aria-describedby={describedBy(hint, error, { hintId, errorId })}
        aria-invalid={error ? true : undefined}
        className={controlClasses(Boolean(error))}
        defaultValue={onChange ? undefined : defaultValue}
        id={id}
        name={name}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldFrame>
  )
}

// --- Checkbox ---------------------------------------------------------------

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
  checked,
  onChange,
}: {
  name: string
  label: string
  hint?: string
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className="flex items-start gap-3">
      <input
        aria-describedby={hint ? hintId : undefined}
        checked={checked}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-[var(--accent-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
        defaultChecked={onChange ? undefined : defaultChecked}
        id={id}
        name={name}
        type="checkbox"
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      />
      <div className="min-w-0">
        <label className="text-sm font-medium text-text-primary" htmlFor={id}>
          {label}
        </label>
        {hint && (
          <p className="mt-1 text-xs text-text-tertiary" id={hintId}>
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}

// --- Feedback ---------------------------------------------------------------

/**
 * Announces the outcome of a submission.
 *
 * `role="alert"` for failures (interrupts, because the operator must act) and
 * `role="status"` for successes (polite, because they need not). Both are
 * always mounted so the live region exists before the text arrives —
 * inserting a live region and its content in the same render is the classic
 * way to have nothing announced at all.
 */
export function FormFeedback({ state }: { state: FormState }) {
  const formLevelIssue = firstError(state.fieldErrors, '_form')
  const message = state.status === 'idle' ? '' : state.message
  const isError = state.status === 'error'

  return (
    <div aria-atomic="true" aria-live={isError ? 'assertive' : 'polite'} className="min-h-0">
      {message !== '' && (
        <p
          className={cn(
            'rounded-md border px-4 py-3 text-sm',
            isError
              ? 'border-[var(--danger)]/40 bg-[var(--danger)]/10 text-[var(--danger)]'
              : 'border-accent-green/40 bg-accent-green/10 text-accent-green'
          )}
          role={isError ? 'alert' : 'status'}
        >
          {message}
          {formLevelIssue && <span className="mt-1 block">{formLevelIssue}</span>}
        </p>
      )}
    </div>
  )
}

// --- Submit -----------------------------------------------------------------

/**
 * Submit button that reflects the pending state of its own form.
 *
 * `aria-disabled` rather than `disabled`: a disabled button drops out of the
 * tab order mid-interaction and can move focus somewhere unexpected. This
 * stays focusable and refuses the click instead.
 */
export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  variant = 'primary',
  name,
  value,
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  variant?: 'primary' | 'secondary' | 'danger'
  name?: string
  value?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  const variants = {
    primary: 'bg-accent-green text-accent-foreground hover:brightness-110',
    secondary:
      'border border-border-strong text-text-primary hover:border-accent-green hover:text-accent-green',
    danger: 'border border-[var(--danger)]/50 text-[var(--danger)] hover:bg-[var(--danger)]/10',
  } as const

  return (
    <button
      aria-disabled={pending || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
        pending && 'cursor-progress opacity-70',
        variants[variant],
        className
      )}
      name={name}
      type="submit"
      value={value}
      onClick={(event) => {
        if (pending) event.preventDefault()
      }}
    >
      {pending ? pendingLabel : children}
    </button>
  )
}
