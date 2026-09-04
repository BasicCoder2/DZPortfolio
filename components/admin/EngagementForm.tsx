'use client'

import { useActionState, useEffect, useState } from 'react'
import { formatEngagementPrice } from '@/lib/content/models'
import { saveEngagementAction } from '@/lib/actions/engagement'
import { firstError, idleFormState } from '@/lib/actions/state'
import { slugifyContent } from '@/lib/content/slug'
import type { EngagementOption } from '@/lib/content/models'
import type { CurrencyMode } from '@/lib/supabase/types'
import {
  CheckboxField,
  FormFeedback,
  SelectField,
  SubmitButton,
  TextAreaField,
  TextField,
} from '@/components/admin/form-controls'

/**
 * Create / edit form for one Engagement (pricing) tier.
 *
 * The live preview under the currency picker is the point of this screen. A
 * price is a short string with a lot riding on it, and the fields that build
 * it — prefix, mode, two amounts, a text override — do not obviously combine.
 * Showing the exact rendered result removes the guess, using the same
 * `formatEngagementPrice` the public card calls.
 */

const CURRENCY_OPTIONS: ReadonlyArray<{ value: CurrencyMode; label: string }> = [
  { value: 'label', label: 'Text only (e.g. "Custom Quote")' },
  { value: 'USD', label: 'US dollars' },
  { value: 'ZMW', label: 'Zambian kwacha' },
  { value: 'BOTH', label: 'Both (USD / ZMW)' },
]

export function EngagementForm({
  option,
  onSaved,
}: {
  option: EngagementOption | null
  onSaved?: () => void
}) {
  const [state, formAction] = useActionState(saveEngagementAction, idleFormState)
  const errors = state.fieldErrors

  const [title, setTitle] = useState(option?.title ?? '')
  const [slug, setSlug] = useState(option?.slug ?? '')
  const [linked, setLinked] = useState(option === null)

  const [currency, setCurrency] = useState<CurrencyMode>(option?.currency ?? 'label')
  const [prefix, setPrefix] = useState(option?.pricePrefix ?? '')
  const [label, setLabel] = useState(option?.priceLabel ?? '')
  const [usd, setUsd] = useState(option?.priceUsd === null ? '' : String(option?.priceUsd ?? ''))
  const [zmw, setZmw] = useState(option?.priceZmw === null ? '' : String(option?.priceZmw ?? ''))

  useEffect(() => {
    if (state.status === 'success') onSaved?.()
  }, [state.status, onSaved])

  const toAmount = (value: string) => {
    const parsed = Number(value.replace(/,/g, '').trim())
    return value.trim() === '' || Number.isNaN(parsed) ? null : parsed
  }

  const preview = formatEngagementPrice({
    currency,
    pricePrefix: prefix,
    priceLabel: label === '' ? null : label,
    priceUsd: toAmount(usd),
    priceZmw: toAmount(zmw),
  })

  const showAmounts = currency !== 'label'

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {option && <input name="id" type="hidden" value={option.id} />}

      <FormFeedback state={state} />

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          required
          error={firstError(errors, 'title')}
          label="Title"
          name="title"
          placeholder="Discovery"
          value={title}
          onChange={(value) => {
            setTitle(value)
            if (linked) setSlug(slugifyContent(value))
          }}
        />
        <TextField
          required
          error={firstError(errors, 'slug')}
          hint="Internal identifier. Not shown on the site."
          label="Slug"
          name="slug"
          placeholder="discovery"
          value={slug}
          onChange={(value) => {
            setSlug(value)
            setLinked(false)
          }}
        />
      </div>

      <TextAreaField
        defaultValue={option?.description ?? ''}
        error={firstError(errors, 'description')}
        hint="One sentence under the price."
        label="Description"
        name="description"
        rows={2}
      />

      <TextAreaField
        defaultValue={option?.items.join('\n') ?? ''}
        error={firstError(errors, 'items')}
        hint="One per line (or comma separated). Rendered as the bullet list."
        label="What is included"
        name="items"
        placeholder={'Requirements analysis\nTechnical consultation\nArchitecture recommendations'}
        rows={4}
      />

      <fieldset className="flex flex-col gap-6 rounded-md border border-border p-5">
        <legend className="px-2 text-sm font-medium text-text-primary">Price</legend>

        <SelectField
          error={firstError(errors, 'currency')}
          hint="Choose what the card shows. Text only ignores the amounts below."
          label="Show price as"
          name="currency"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={(value) => setCurrency(value as CurrencyMode)}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <TextField
            error={firstError(errors, 'pricePrefix')}
            hint='Optional lead-in, e.g. "Starting from".'
            label="Prefix"
            name="pricePrefix"
            placeholder="Starting from"
            value={prefix}
            onChange={setPrefix}
          />
          <TextField
            error={firstError(errors, 'priceUsd')}
            hint={showAmounts ? undefined : 'Unused while showing text only.'}
            inputMode="decimal"
            label="USD amount"
            min="0"
            name="priceUsd"
            placeholder="150"
            step="0.01"
            type="number"
            value={usd}
            onChange={setUsd}
          />
          <TextField
            error={firstError(errors, 'priceZmw')}
            hint={showAmounts ? undefined : 'Unused while showing text only.'}
            inputMode="decimal"
            label="ZMW amount"
            min="0"
            name="priceZmw"
            placeholder="4000"
            step="0.01"
            type="number"
            value={zmw}
            onChange={setZmw}
          />
        </div>

        <TextField
          error={firstError(errors, 'priceLabel')}
          hint={'Used when "Text only" is selected, e.g. "Custom Quote" or "Let’s Discuss".'}
          label="Price text"
          name="priceLabel"
          placeholder="Custom Quote"
          value={label}
          onChange={setLabel}
        />

        <div className="rounded-md border border-border bg-surface px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-green">
            Card preview
          </p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {preview === '' ? (
              <span className="text-base font-normal text-text-tertiary">
                Nothing to show yet — fill in the amount or the price text.
              </span>
            ) : (
              preview
            )}
          </p>
        </div>
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
        <TextField
          defaultValue={String(option?.displayOrder ?? 0)}
          error={firstError(errors, 'displayOrder')}
          hint="Lower numbers appear first. The section shows three across."
          inputMode="numeric"
          label="Display order"
          min="0"
          name="displayOrder"
          type="number"
        />
        <div className="flex flex-col justify-end gap-4 pb-2">
          <CheckboxField
            defaultChecked={option?.recommended ?? false}
            hint="Adds the Recommended badge and the green rule."
            label="Highlight as recommended"
            name="recommended"
          />
          <CheckboxField
            defaultChecked={option?.published ?? false}
            hint="Unpublished options never reach the site."
            label="Show on the public site"
            name="published"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <SubmitButton>{option ? 'Save pricing' : 'Add option'}</SubmitButton>
      </div>
    </form>
  )
}
