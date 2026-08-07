'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { m, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useNavigationState } from '@/hooks/useNavigationState'
import { CTAButton } from './CTAButton'
import {
  mobileMenuPreset,
  mobileMenuBackdropPreset,
  mobileMenuLinksVariants,
  mobileMenuLinkVariants,
} from '@/lib/motion'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Full-screen mobile menu overlay.
 * Uses Framer Motion for slide-in animation and manages scroll locking.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock scroll when menu is open
  useScrollLock(isOpen)

  const { pathname, activeSection } = useNavigationState()
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL

  // Close menu on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      return activeSection === targetId
    }
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            {...mobileMenuBackdropPreset}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <m.div
            {...mobileMenuPreset}
            aria-label="Mobile navigation menu"
            aria-modal="true"
            className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-surface-raised border-l border-border shadow-2xl md:hidden flex flex-col"
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-end p-6 h-[80px]">
              <button
                aria-label="Close menu"
                className="p-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green rounded-md"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col">
              <m.nav
                animate="visible"
                className="flex flex-col gap-6"
                initial="hidden"
                variants={mobileMenuLinksVariants}
              >
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href)
                  return (
                    <m.div key={link.label} variants={mobileMenuLinkVariants}>
                      <Link
                        className={`text-2xl font-heading font-semibold transition-colors ${
                          active ? 'text-accent-green' : 'text-text-primary hover:text-accent-green'
                        }`}
                        href={link.href}
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    </m.div>
                  )
                })}
              </m.nav>

              <div className="mt-12 flex flex-col gap-8">
                {resumeUrl && (
                  <CTAButton
                    className="w-full"
                    href={resumeUrl}
                    label="Download CV"
                    onClick={onClose}
                  />
                )}

                {/* Socials row */}
                <div className="flex items-center gap-6">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      aria-label={social.ariaLabel}
                      className="text-text-secondary hover:text-accent-green transition-colors text-sm font-mono uppercase tracking-widest"
                      href={social.href}
                      key={social.name}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
