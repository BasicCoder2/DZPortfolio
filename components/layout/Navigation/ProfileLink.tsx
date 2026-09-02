import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/data/site'
import { cn } from '@/lib/utils'

interface ProfileLinkProps {
  className?: string
  onClick?: () => void
}

/**
 * Avatar entry point to the shareable profile card at /me.
 *
 * Sits on the right of the bar rather than replacing the wordmark: the
 * top-left mark is the one affordance every visitor trusts to go home, and a
 * profile affordance is conventionally on the right.
 */
export function ProfileLink({ className, onClick }: ProfileLinkProps) {
  return (
    <Link
      aria-label={`${siteConfig.author.name} — profile and links`}
      className={cn(
        'group relative block h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border transition-colors duration-200 hover:border-accent-green',
        className
      )}
      href="/me"
      onClick={onClick}
    >
      <Image
        alt=""
        className="h-full w-full object-cover object-center"
        height={72}
        sizes="36px"
        src={siteConfig.profile.avatar}
        width={72}
      />
    </Link>
  )
}
