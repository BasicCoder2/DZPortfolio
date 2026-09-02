'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigationState } from '@/hooks/useNavigationState'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { navPreset } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

import { Wordmark } from './Wordmark'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'
import { CTAButton } from './CTAButton'
import { ProfileLink } from './ProfileLink'

/**
 * Main application navigation bar.
 * Sticky header that adapts to scroll state and handles mobile/desktop layouts.
 */
export function Navigation() {
  const { isScrolled } = useNavigationState()
  const scrollProgress = useScrollProgress()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || '/assets/cv/daniel-zimba-cv.pdf'

  return (
    <>
      <m.header
        {...navPreset}
        aria-label="Main navigation"
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[height,background-color,backdrop-filter,border-color,box-shadow] duration-300',
          isScrolled
            ? 'h-[var(--nav-h-scrolled)] bg-bg/80 backdrop-blur-md border-b border-border shadow-sm'
            : 'h-[var(--nav-h)] bg-transparent border-transparent'
        )}
        role="banner"
      >
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-6 md:px-8 lg:px-12">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Wordmark onClick={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />

            <div aria-hidden="true" className="hidden lg:block w-px h-6 bg-border mx-2" />

            <div className="hidden lg:flex items-center gap-3">
              <ProfileLink />
              <ThemeToggle />
              {resumeUrl && (
                <CTAButton
                  className="hidden border border-border-strong bg-transparent text-text-primary hover:bg-surface-muted lg:inline-flex"
                  href={resumeUrl}
                  label="Download CV"
                />
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ProfileLink onClick={() => setIsMobileMenuOpen(false)} />
            <ThemeToggle />
            <Button
              data-menu-trigger
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              size="icon"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              {isMobileMenuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </m.header>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent-green"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Full-screen mobile menu overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
