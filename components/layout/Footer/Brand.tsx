import { siteConfig } from '@/data/site'

/**
 * Footer Brand component.
 * Displays the owner's name and role from the global siteConfig.
 */
export function Brand() {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-heading font-bold text-xl text-text-primary tracking-tight">
        {siteConfig.author.name}
      </span>
      <span className="text-sm text-text-secondary">{siteConfig.author.role}</span>
    </div>
  )
}
