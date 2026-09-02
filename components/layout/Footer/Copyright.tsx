import { siteConfig } from '@/data/site'

/**
 * Footer Copyright component.
 * Displays the current year and the author's name.
 */
export function Copyright() {
  const currentYear = new Date().getFullYear()

  return (
    <p className="text-sm text-text-tertiary">
      &copy; {currentYear} {siteConfig.author.name}. All rights reserved.
    </p>
  )
}
