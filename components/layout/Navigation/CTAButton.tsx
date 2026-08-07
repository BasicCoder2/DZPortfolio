import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface CTAButtonProps {
  label: string
  href: string
  className?: string
  onClick?: () => void
  external?: boolean
}

/**
 * Reusable CTA button for the navigation and other high-prominence areas.
 * Uses the design system Button component for consistency.
 */
export function CTAButton({ label, href, className, onClick, external }: CTAButtonProps) {
  const isInternal = !external && href.startsWith('/')

  if (isInternal) {
    return (
      <Button asChild className={className} size="sm" variant="primary">
        <Link href={href} onClick={onClick}>
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button asChild className={className} size="sm" variant="primary">
      <a
        href={href}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
        onClick={onClick}
      >
        {label}
      </a>
    </Button>
  )
}
