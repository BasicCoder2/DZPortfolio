import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
    return <Link className={cn(buttonVariants({ size: 'sm', variant: 'primary' }), className)} href={href} onClick={onClick}>{label}</Link>
  }

  return <a className={cn(buttonVariants({ size: 'sm', variant: 'primary' }), className)} href={href} rel={external ? 'noopener noreferrer' : undefined} target={external ? '_blank' : undefined} onClick={onClick}>{label}</a>
}
