'use client'

import * as React from 'react'
import { Copy, ExternalLink as ExternalLinkIcon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconButton } from './icon-button'

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <IconButton
      aria-label="Copy to clipboard"
      className={className}
      variant="ghost"
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Sparkles className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </IconButton>
  )
}

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

function ExternalLink({ href, className, children, ...props }: ExternalLinkProps) {
  return (
    <a
      className={cn('inline-flex items-center gap-2 text-[var(--primary)]', className)}
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
      <ExternalLinkIcon className="h-4 w-4" />
    </a>
  )
}

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

function GradientText({ className, children, ...props }: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export interface HighlightProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Highlight({ className, children, ...props }: HighlightProps) {
  return (
    <mark
      className={cn(
        'rounded-[var(--radius-sm)] bg-[var(--primary)]/10 px-1 py-0.5 text-[var(--foreground)]',
        className
      )}
      {...props}
    >
      {children}
    </mark>
  )
}

export interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
}

function Metric({ label, value, className, ...props }: MetricProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-sm)]',
        className
      )}
      {...props}
    >
      <p className="text-2xl font-semibold text-[var(--foreground)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{label}</p>
    </div>
  )
}

export { CopyButton, ExternalLink, GradientText, Highlight, Metric }
