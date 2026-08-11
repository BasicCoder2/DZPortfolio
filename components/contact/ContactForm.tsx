'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { z } from 'zod'

const schema = z.object({ name: z.string().trim().min(2, 'Please enter your name.'), email: z.string().email('Please enter a valid email.'), subject: z.string().trim().min(3, 'Please add a subject.'), message: z.string().trim().min(10, 'Please add a little more detail.') })
type FormValues = z.infer<typeof schema>
const initialValues: FormValues = { name: '', email: '', subject: '', message: '' }

export function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const result = schema.safeParse(values); if (!result.success) { setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0] as keyof FormValues, issue.message]))); setStatus('error'); return } setErrors({}); setStatus('success') }
  return <form noValidate className="space-y-5" onSubmit={submit}>{(['name', 'email', 'subject'] as const).map((field) => <label className="block space-y-2" key={field}><span className="text-sm font-medium text-text-primary">{field[0].toUpperCase() + field.slice(1)}</span><input className="w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent-green" name={field} value={values[field]} onChange={(event) => setValues({ ...values, [field]: event.target.value })} />{errors[field] && <span className="text-sm text-danger">{errors[field]}</span>}</label>)}<label className="block space-y-2"><span className="text-sm font-medium text-text-primary">Message</span><textarea className="min-h-36 w-full rounded-md border border-border bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent-green" name="message" value={values.message} onChange={(event) => setValues({ ...values, message: event.target.value })} />{errors.message && <span className="text-sm text-danger">{errors.message}</span>}</label><button className="rounded-full bg-[#7CFF4F] px-6 py-3 font-medium text-[#07111f] transition-transform hover:-translate-y-0.5" type="submit">Send enquiry</button>{status === 'success' && <p className="text-sm text-success" role="status">Thanks — the form is validated and ready for delivery integration.</p>}{status === 'error' && <p className="text-sm text-danger" role="alert">Please review the highlighted fields.</p>}</form>
}
