import { describe, expect, it } from 'vitest'
import { formatEngagementPrice, toCertification, toExperience } from '@/lib/content/models'
import type { CertificationRecord, ExperienceRecord } from '@/lib/supabase/types'

/**
 * Presentation logic that the public page depends on and that a reviewer
 * cannot verify by reading a component.
 */

describe('formatEngagementPrice', () => {
  const base = { pricePrefix: '', priceLabel: null, priceUsd: null, priceZmw: null }

  it('reproduces the pricing the site shipped with', () => {
    // These three strings are what visitors see today. The migration to
    // database-backed pricing must not change them.
    expect(
      formatEngagementPrice({
        ...base,
        currency: 'USD',
        pricePrefix: 'Starting from',
        priceUsd: 150,
      })
    ).toBe('Starting from $150')

    expect(formatEngagementPrice({ ...base, currency: 'label', priceLabel: 'Custom Quote' })).toBe(
      'Custom Quote'
    )

    expect(formatEngagementPrice({ ...base, currency: 'label', priceLabel: "Let's Discuss" })).toBe(
      "Let's Discuss"
    )
  })

  it('formats kwacha', () => {
    const rendered = formatEngagementPrice({ ...base, currency: 'ZMW', priceZmw: 4000 })
    expect(rendered).toMatch(/4,000/)
    expect(rendered).toMatch(/K|ZMW/)
  })

  it('shows both currencies side by side', () => {
    const rendered = formatEngagementPrice({
      ...base,
      currency: 'BOTH',
      priceUsd: 150,
      priceZmw: 4000,
    })

    expect(rendered).toContain('$150')
    expect(rendered).toContain('/')
    expect(rendered).toMatch(/4,000/)
  })

  it('applies the prefix to every numeric mode', () => {
    expect(
      formatEngagementPrice({
        ...base,
        currency: 'BOTH',
        pricePrefix: 'From',
        priceUsd: 150,
        priceZmw: 4000,
      })
    ).toMatch(/^From \$150 \//)
  })

  it('drops fractional cents, because these are headline prices', () => {
    expect(formatEngagementPrice({ ...base, currency: 'USD', priceUsd: 1500.49 })).toBe('$1,500')
  })

  it('renders nothing when the promised amount is missing', () => {
    // The schema and a CHECK constraint both prevent this, so it should be
    // unreachable — but rendering "undefined" on a price would be worse than
    // rendering nothing.
    expect(formatEngagementPrice({ ...base, currency: 'USD' })).toBe('')
    expect(formatEngagementPrice({ ...base, currency: 'BOTH', priceUsd: 150 })).toBe('')
    expect(formatEngagementPrice({ ...base, currency: 'label' })).toBe('')
  })
})

function experienceRow(overrides: Partial<ExperienceRecord> = {}): ExperienceRecord {
  return {
    id: 'e1',
    organization: 'Levy Mwanawasa Medical University',
    role: 'Software Developer',
    location: '',
    start_date: null,
    end_date: null,
    is_current: false,
    summary: '',
    technologies: [],
    display_order: 0,
    published: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('experience period', () => {
  it('is empty when no dates were recorded', () => {
    // The migrated CV had none. An empty string makes the timeline omit the
    // line entirely, which is why the placeholder "Details pending
    // confirmation" no longer appears anywhere.
    expect(toExperience(experienceRow()).period).toBe('')
  })

  it('shows a closed range', () => {
    const entry = toExperience(experienceRow({ start_date: '2023-03-01', end_date: '2024-11-01' }))
    expect(entry.period).toBe('Mar 2023 — Nov 2024')
  })

  it('shows Present for a current role', () => {
    const entry = toExperience(experienceRow({ start_date: '2023-03-01', is_current: true }))
    expect(entry.period).toBe('Mar 2023 — Present')
  })

  it('shows just the start when there is no end date', () => {
    expect(toExperience(experienceRow({ start_date: '2023-03-01' })).period).toBe('Mar 2023')
  })

  it('does not roll a January date back into the previous year', () => {
    // A bare date parses as UTC midnight; formatting it in a negative-offset
    // zone without timeZone: 'UTC' would render "Dec 2022".
    expect(toExperience(experienceRow({ start_date: '2023-01-01' })).period).toBe('Jan 2023')
  })
})

function certificationRow(overrides: Partial<CertificationRecord> = {}): CertificationRecord {
  return {
    id: 'c1',
    title: 'Huawei AI',
    issuer: 'Huawei',
    issue_date: null,
    credential_url: null,
    credential_id: null,
    image_path: null,
    image_alt: null,
    display_order: 0,
    published: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('certification date label', () => {
  it('falls back to an em dash rather than a placeholder sentence', () => {
    expect(toCertification(certificationRow()).issuedLabel).toBe('—')
  })

  it('formats a known date as month and year', () => {
    expect(toCertification(certificationRow({ issue_date: '2024-03-15' })).issuedLabel).toBe(
      'Mar 2024'
    )
  })
})
