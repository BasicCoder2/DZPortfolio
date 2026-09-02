'use client'

import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { contactSchema, type ContactFormValues } from '@/lib/contact'

type FormValues = Omit<ContactFormValues, 'website'>
const initialValues: FormValues = { name: '', email: '', subject: '', message: '' }
const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off' },
] as const

export function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const feedbackRef = useRef<HTMLParagraphElement>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const result = contactSchema.safeParse({ ...values, website: new FormData(form).get('website') })

    if (!result.success) {
      const nextErrors = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path[0] as keyof FormValues, issue.message])
      )
      setErrors(nextErrors)
      setStatus('error')
      setFeedback('Please review the highlighted fields.')
      window.requestAnimationFrame(() => feedbackRef.current?.focus())
      return
    }

    setErrors({})
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      const body: unknown = await response.json().catch(() => null)
      const message = body && typeof body === 'object' && 'message' in body && typeof body.message === 'string'
        ? body.message
        : 'Unable to send your message right now. Please try again later.'

      if (!response.ok) {
        setStatus('error')
        setFeedback(message)
        return
      }

      setStatus('success')
      setFeedback(message)
      setValues(initialValues)
    } catch {
      setStatus('error')
      setFeedback('Unable to send your message right now. Please try again later.')
    } finally {
      setIsSubmitting(false)
      window.requestAnimationFrame(() => feedbackRef.current?.focus())
    }
  }

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  return (
    <form noValidate aria-describedby="contact-form-note" className="space-y-6" onSubmit={submit}>
      <p className="text-sm leading-6 text-text-secondary" id="contact-form-note">
        Tell me a little about what you are building, and I’ll get back to you soon.
      </p>
      {status === 'error' && (
        <p
          aria-live="assertive"
          className="border-l-2 border-danger pl-3 text-sm text-danger"
          ref={feedbackRef}
          role="alert"
          tabIndex={-1}
        >
          {feedback}
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
          {feedback}
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
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="website">Website</label>
        <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" />
      </div>
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
        className="inline-flex min-h-12 items-center justify-center bg-accent-green px-6 py-3 font-medium text-[#07111f] transition-transform hover:-translate-y-0.5 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
