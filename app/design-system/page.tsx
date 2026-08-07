import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import { Button } from '@/components/ui'

const spacingScale = ['2', '4', '8', '12', '16', '20', '24', '32', '40', '48', '64', '80', '96']
const radiusScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill']
const elevationScale = ['none', 'sm', 'md', 'lg', 'xl', 'glass', 'overlay']

export default function DesignSystemPage() {
  return (
    <Container size="site">
      <Section className="pt-20 pb-12" id="overview">
        <div className="max-w-3xl space-y-4">
          <span className="token-chip">Design system</span>
          <h1 className="text-h1">Visual language showcase</h1>
          <p className="text-body-lg text-muted">
            Development-only reference for typography, colors, spacing, surfaces, motion, and focus behavior.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="primary">Primary action</Button>
            <Button size="sm" variant="outline">Secondary action</Button>
            <Button size="sm" variant="ghost">Ghost action</Button>
          </div>
        </div>
      </Section>

      <Section className="py-0" id="typography">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Typography</p>
            <h2 className="text-h2">Fluid hierarchy</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-display">Display XL</h1>
              <h2 className="text-h1">Heading 1</h2>
              <h3 className="text-h2">Heading 2</h3>
              <h4 className="text-h3">Heading 3</h4>
              <p className="text-lead">Lead copy carries a calm, confident rhythm with generous line height.</p>
              <p className="text-body">Body copy remains highly legible and restrained, prioritizing clarity over ornament.</p>
            </div>
            <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] p-6">
              <p className="text-overline uppercase tracking-[0.24em]">Label</p>
              <p className="text-body-sm">Body small for metadata and captions.</p>
              <p className="text-caption">Caption with subdued contrast.</p>
              <code className="block rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 text-code">const quality = 'precision'</code>
              <blockquote className="border-l-2 border-[var(--primary)] pl-4 text-quote">System thinking is expressed through clarity, rhythm, and restraint.</blockquote>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="colors">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Color system</p>
            <h2 className="text-h2">Semantic tokens</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Background', 'var(--background)'],
              ['Surface', 'var(--surface)'],
              ['Surface Elevated', 'var(--surface-elevated)'],
              ['Primary', 'var(--primary)'],
              ['Secondary', 'var(--secondary)'],
              ['Accent', 'var(--accent)'],
              ['Success', 'var(--success)'],
              ['Danger', 'var(--danger)'],
            ].map(([name, value]) => (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]" key={name}>
                <div className="mb-4 h-16 rounded-[var(--radius-md)] border border-[var(--border)]" style={{ backgroundColor: value }} />
                <p className="text-body-sm font-medium">{name}</p>
                <p className="text-caption text-muted">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="spacing">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Spacing</p>
            <h2 className="text-h2">Formal rhythm</h2>
          </div>
          <div className="space-y-3">
            {spacingScale.map((size) => (
              <div className="flex items-center gap-4" key={size}>
                <div className="w-12 text-caption text-muted">{size}</div>
                <div className="h-3 flex-1 rounded-full bg-[var(--primary)]/75" style={{ width: `calc(${size}px * 1.4)` }} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="radius">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Radius</p>
            <h2 className="text-h2">Soft precision</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {radiusScale.map((token) => (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4" key={token}>
                <div className="mb-3 h-12 border border-[var(--border)] bg-[var(--surface-muted)]" style={{ borderRadius: `var(--radius-${token})` }} />
                <p className="text-body-sm font-medium">{token}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="elevation">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Elevation</p>
            <h2 className="text-h2">Surface hierarchy</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {elevationScale.map((token) => (
              <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4" key={token} style={{ boxShadow: `var(--shadow-${token === 'glass' ? 'glass' : token === 'overlay' ? 'overlay' : token})` }}>
                <p className="text-body-sm font-medium">{token}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="motion">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Motion</p>
            <h2 className="text-h2">Measured transitions</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-all duration-300 hover:-translate-y-1">
              <p className="text-body-sm font-medium">Hover</p>
              <p className="text-caption text-muted">150ms with a gentle rise</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 motion-safe:transition-all motion-safe:duration-400">
              <p className="text-body-sm font-medium">Page transition</p>
              <p className="text-caption text-muted">400ms with eased motion</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 motion-reduce:transition-none">
              <p className="text-body-sm font-medium">Reduced motion</p>
              <p className="text-caption text-muted">No animation when requested</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="accessibility">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.24em] text-muted">Accessibility</p>
            <h2 className="text-h2">WCAG AA support</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-body-sm font-medium">Visible focus</p>
              <p className="text-caption text-muted">Interactive states expose a high-contrast ring with clear offset.</p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-body-sm font-medium">Keyboard friendly</p>
              <p className="text-caption text-muted">All controls remain operable using a logical tab sequence.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="navigation">
        <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
          <p className="text-body-sm text-muted">Developer only route for future component reviews.</p>
          <Link className="text-body-sm font-medium text-[var(--primary)]" href="/">Return home</Link>
        </div>
      </Section>
    </Container>
  )
}
