'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigationState } from '@/hooks/useNavigationState'
import { navPreset } from '@/lib/motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'

import { Wordmark } from './Wordmark'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'
import { CTAButton } from './CTAButton'

/**
 * Main application navigation bar.
 * Sticky header that adapts to scroll state and handles mobile/desktop layouts.
 */
export function Navigation() {
  const { isScrolled } = useNavigationState()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL

  return (
    <>
      <m.header
        {...navPreset}
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'h-[72px] bg-bg/80 backdrop-blur-md border-b border-border shadow-sm'
            : 'h-[88px] bg-transparent border-transparent'
        )}
        role="banner"
      >
        <div className="w-full max-w-[1200px] mx-auto h-full px-6 md:px-8 lg:px-12 flex items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Wordmark onClick={() => setIsMobileMenuOpen(false)} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />

            <div aria-hidden="true" className="hidden lg:block w-px h-6 bg-border mx-2" />

            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              {resumeUrl && (
                <CTAButton className="hidden lg:inline-flex" href={resumeUrl} label="Download CV" />
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              size="icon"
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      {/* Full-screen mobile menu overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
