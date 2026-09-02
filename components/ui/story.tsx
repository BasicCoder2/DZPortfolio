import * as React from 'react'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardBody, CardHeader } from './card'
import { Input } from './input'
import { Progress } from './progress'
import { Surface } from './surface'
import { Chip } from './chip'
import { Tag } from './tag'
import { Text } from './text'

export interface StorySectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function StorySection({ title, description, children }: StorySectionProps) {
  return (
    <section className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
      <div className="space-y-1">
        <Text as="h3">{title}</Text>
        {description ? (
          <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Progress,
  StorySection,
  Surface,
  Tag,
  Text,
}
