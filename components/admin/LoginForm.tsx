'use client'

import { useActionState } from 'react'
import { signInAction } from '@/lib/actions/auth'
import { firstError, idleFormState } from '@/lib/actions/state'
import { FormFeedback, SubmitButton, TextField } from '@/components/admin/form-controls'

/**
 * Sign-in form.
 *
 * The destination arrives already sanitized from the server component and is
 * re-sanitized inside the action — this hidden input is attacker-reachable
 * like any other form field, so it is never trusted on the way back in.
 */
export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signInAction, idleFormState)

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input name="next" type="hidden" value={next} />

      <FormFeedback state={state} />

      <TextField
        required
        autoComplete="username"
        error={firstError(state.fieldErrors, 'email')}
        label="Email"
        name="email"
        placeholder="you@example.com"
        type="email"
      />

      <TextField
        required
        autoComplete="current-password"
        error={firstError(state.fieldErrors, 'password')}
        label="Password"
        name="password"
        type="password"
      />

      <SubmitButton className="mt-1 w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  )
}
