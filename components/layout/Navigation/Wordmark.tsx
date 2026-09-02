import Link from 'next/link'
import { cn } from '@/lib/utils'

interface WordmarkProps {
  className?: string
  onClick?: () => void
}

/**
 * Wordmark component.
 * Temporarily used in place of an SVG logo. Features a subtle glow on hover.
 */
export function Wordmark({ className, onClick }: WordmarkProps) {
  return (
    <Link
      aria-label="Daniel Zimba - Home"
      className={cn('relative inline-flex items-center group', className)}
      href="/"
      onClick={onClick}
    >
      <span className="font-heading font-bold text-2xl tracking-tighter text-text-primary transition-colors duration-300 group-hover:text-accent-green">
        DZ
      </span>
      <span className="absolute -inset-2 bg-accent-green-glow blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  )
}
