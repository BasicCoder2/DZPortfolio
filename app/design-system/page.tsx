import Link from 'next/link'
import { Container, Section } from '@/components/layout'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CopyButton,
  DesktopNav,
  Feedback,
  Field,
  FieldDescription,
  FieldLabel,
  FormCheckbox,
  FormInput,
  FormSelect,
  FormSwitch,
  FormTextarea,
  FormRadioGroup,
  FormRadioItem,
  GradientText,
  Highlight,
  IconButton,
  LinkButton,
  Metric,
  MobileNav,
  Surface,
  Tag,
  Text,
  ThemeSwitcher,
  Tooltip,
} from '@/components/ui'

const spacingScale = ['2', '4', '8', '12', '16', '20', '24', '32', '40', '48', '64', '80', '96']
const radiusScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'pill']
const elevationScale = ['none', 'sm', 'md', 'lg', 'xl', 'glass', 'overlay']

const navItems = [
  { href: '#typography', label: 'Typography' },
  { href: '#buttons', label: 'Buttons' },
  { href: '#forms', label: 'Forms' },
  { href: '#feedback', label: 'Feedback' },
]

export default function DesignSystemPage() {
  return (
    <Container size="site">
      <Section className="pb-12 pt-20" id="overview">
        <div className="max-w-3xl space-y-4">
          <span className="token-chip">Design system</span>
          <h1 className="text-h1">Component library showcase</h1>
          <p className="text-body-lg text-muted">
            Development-only reference for typography, colors, spacing, surfaces, motion, and focus
            behavior.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="primary">
              Primary action
            </Button>
            <Button size="sm" variant="outline">
              Secondary action
            </Button>
            <Button size="sm" variant="ghost">
              Ghost action
            </Button>
          </div>
        </div>
      </Section>

      <Section className="py-0" id="typography">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Typography</p>
            <h2 className="text-h2">Fluid hierarchy</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-display">Display XL</h1>
              <h2 className="text-h1">Heading 1</h2>
              <h3 className="text-h2">Heading 2</h3>
              <h4 className="text-h3">Heading 3</h4>
              <p className="text-lead">
                Lead copy carries a calm, confident rhythm with generous line height.
              </p>
              <p className="text-body">
                Body copy remains highly legible and restrained, prioritizing clarity over ornament.
              </p>
            </div>
            <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] p-6">
              <p className="text-overline uppercase tracking-[0.16em]">Label</p>
              <p className="text-body-sm">Body small for metadata and captions.</p>
              <p className="text-caption">Caption with subdued contrast.</p>
              <code className="block rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3 text-code">
                const quality = 'precision'
              </code>
              <blockquote className="border-l-2 border-[var(--primary)] pl-4 text-quote">
                System thinking is expressed through clarity, rhythm, and restraint.
              </blockquote>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="colors">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Color system</p>
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
              <div
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]"
                key={name}
              >
                <div
                  className="mb-4 h-16 rounded-[var(--radius-md)] border border-[var(--border)]"
                  style={{ backgroundColor: value }}
                />
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
            <p className="text-label uppercase tracking-[0.16em] text-muted">Spacing</p>
            <h2 className="text-h2">Formal rhythm</h2>
          </div>
          <div className="space-y-3">
            {spacingScale.map((size) => (
              <div className="flex items-center gap-4" key={size}>
                <div className="w-12 text-caption text-muted">{size}</div>
                <div
                  className="h-3 flex-1 rounded-full bg-[var(--primary)]/75"
                  style={{ width: `calc(${size}px * 1.4)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="radius">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Radius</p>
            <h2 className="text-h2">Soft precision</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {radiusScale.map((token) => (
              <div
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                key={token}
              >
                <div
                  className="mb-3 h-12 border border-[var(--border)] bg-[var(--surface-muted)]"
                  style={{ borderRadius: `var(--radius-${token})` }}
                />
                <p className="text-body-sm font-medium">{token}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="elevation">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Elevation</p>
            <h2 className="text-h2">Surface hierarchy</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {elevationScale.map((token) => (
              <div
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                key={token}
                style={{
                  boxShadow: `var(--shadow-${token === 'glass' ? 'glass' : token === 'overlay' ? 'overlay' : token})`,
                }}
              >
                <p className="text-body-sm font-medium">{token}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8" id="buttons">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Buttons</p>
            <h2 className="text-h2">Core interactions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <IconButton aria-label="Open menu" variant="default">
              <span>+</span>
            </IconButton>
            <LinkButton href="/design-system" variant="primary">
              Link button
            </LinkButton>
            <Tooltip content="Helpful hint" side="top">
              <Badge variant="info">Tooltip</Badge>
            </Tooltip>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="forms">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Forms</p>
            <h2 className="text-h2">Accessible primitives</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>Use a concise label.</FieldDescription>
                <FormInput id="name" placeholder="Ada Lovelace" />
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <FormSelect id="role">
                  <option value="engineer">Engineer</option>
                  <option value="designer">Designer</option>
                </FormSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="notes">Notes</FieldLabel>
                <FormTextarea id="notes" placeholder="Add context here." />
              </Field>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Preferences</label>
                <div className="flex flex-wrap gap-3">
                  <FormCheckbox checked readOnly>
                    Receive updates
                  </FormCheckbox>
                  <FormSwitch checked readOnly>
                    Enable notifications
                  </FormSwitch>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--foreground)]">Delivery</label>
                <FormRadioGroup defaultValue="fast">
                  <div className="flex items-center gap-2">
                    <FormRadioItem value="fast" />
                    <span className="text-sm">Fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FormRadioItem value="balanced" />
                    <span className="text-sm">Balanced</span>
                  </div>
                </FormRadioGroup>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="cards">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Cards & surfaces</p>
            <h2 className="text-h2">Composable containers</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-0" variant="elevated">
              <CardHeader>
                <Text as="h3">Surface card</Text>
              </CardHeader>
              <CardBody>
                <p className="text-body-sm text-muted">
                  Cards inherit the surface system and stay neutral enough to host any content.
                </p>
              </CardBody>
            </Card>
            <Surface className="p-6" shadow="md" tone="overlay">
              <div className="space-y-3">
                <Tag tone="accent">Glass surface</Tag>
                <p className="text-body-sm text-muted">
                  Overlay surfaces provide a lightweight glass effect for immersive layouts.
                </p>
              </div>
            </Surface>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="navigation-primitives">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Navigation</p>
            <h2 className="text-h2">Responsive primitives</h2>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[var(--foreground)]">Internal UI</span>
                <Badge variant="secondary">v1</Badge>
              </div>
              <div className="flex items-center gap-2">
                <DesktopNav items={navItems} />
                <ThemeSwitcher />
                <MobileNav items={navItems} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="feedback">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Feedback</p>
            <h2 className="text-h2">Status and empty states</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Alert
              description="The operation completed successfully."
              title="Success"
              variant="success"
            />
            <Feedback
              action={
                <Button size="sm" variant="primary">
                  Retry
                </Button>
              }
              description="No content is available yet."
              kind="empty"
              title="Nothing to show"
            />
            <Feedback
              description="Loading details for the current view."
              kind="loading"
              title="Loading"
            />
            <Alert
              description="Please review the input before proceeding."
              title="Warning"
              variant="warning"
            />
          </div>
        </div>
      </Section>

      <Section className="py-8" id="motion">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Motion</p>
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

      <Section className="py-8" id="utilities">
        <div className="section-shell space-y-8">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-[0.16em] text-muted">Utilities</p>
            <h2 className="text-h2">Helpful helpers</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Metric label="System readiness" value="100%" />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-body-sm font-medium">Copy snippet</p>
                  <p className="text-caption text-muted">Useful for quick demos.</p>
                </div>
                <CopyButton aria-label="Copy snippet" value="Design systems are composable." />
              </div>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex flex-wrap gap-2">
                <Highlight>Highlighted text</Highlight>
                <GradientText>Gradient text</GradientText>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-8" id="overview-footer">
        <div className="flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]">
          <p className="text-body-sm text-muted">
            Developer-only route for future component reviews.
          </p>
          <Link className="text-body-sm font-medium text-[var(--primary)]" href="/">
            Return home
          </Link>
        </div>
      </Section>
    </Container>
  )
}
