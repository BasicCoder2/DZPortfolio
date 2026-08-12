'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { z } from 'zod'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email.'),
  subject: z.string().trim().min(3, 'Please add a subject.'),
  message: z.string().trim().min(10, 'Please add a little more detail.'),
})

type FormValues = z.infer<typeof schema>
const initialValues: FormValues = { name: '', email: '', subject: '', message: '' }
const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off' },
] as const

export function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const feedbackRef = useRef<HTMLParagraphElement>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = schema.safeParse(values)

    if (!result.success) {
      const nextErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0] as keyof FormValues, issue.message])
      )
      setErrors(nextErrors)
      setStatus('error')
      window.requestAnimationFrame(() => feedbackRef.current?.focus())
      return
    }

    setErrors({})
    setStatus('success')
    window.requestAnimationFrame(() => feedbackRef.current?.focus())
  }

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  return (
    <form noValidate aria-describedby="contact-form-note" className="space-y-6" onSubmit={submit}>
      <p className="text-sm leading-6 text-text-secondary" id="contact-form-note">
        This form validates locally. Delivery will be connected once a provider is configured.
      </p>
      {status === 'error' && (
        <p
          aria-live="assertive"
          className="border-l-2 border-danger pl-3 text-sm text-danger"
          ref={feedbackRef}
          role="alert"
          tabIndex={-1}
        >
          Please review the highlighted fields.
        </p>
      )}
      {status === 'success' && (
        <p
          aria-live="polite"
          className="border-l-2 border-success pl-3 text-sm text-success"
          ref={feedbackRef}
          role="status"
          tabIndex={-1}
        >
          Thanks — the form is validated and ready for delivery integration.
        </p>
      )}
      {fields.map((field) => {
        const errorId = `${field.name}-error`
        const hasError = Boolean(errors[field.name])
        return (
          <div className="space-y-2" key={field.name}>
            <label className="block text-sm font-medium text-text-primary" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError || undefined}
              autoComplete={field.autoComplete}
              className="w-full border border-border bg-bg px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent-green focus:ring-2 focus:ring-accent-green/20"
              id={field.name}
              name={field.name}
              type={field.type}
              value={values[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
            />
            {hasError && (
              <p className="text-sm text-danger" id={errorId}>
                {errors[field.name]}
              </p>
            )}
          </div>
        )
      })}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary" htmlFor="message">
          Message
        </label>
        <textarea
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={Boolean(errors.message) || undefined}
          className="min-h-40 w-full resize-y border border-border bg-bg px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent-green focus:ring-2 focus:ring-accent-green/20"
          id="message"
          name="message"
          value={values.message}
          onChange={(event) => updateField('message', event.target.value)}
        />
        {errors.message && (
          <p className="text-sm text-danger" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <button
        className="inline-flex min-h-12 items-center justify-center bg-accent-green px-6 py-3 font-medium text-[#07111f] transition-transform hover:-translate-y-0.5 focus-visible:ring-offset-bg"
        type="submit"
      >
        Send enquiry
      </button>
    </form>
  )
}
