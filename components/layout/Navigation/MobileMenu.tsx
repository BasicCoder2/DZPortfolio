'use client'

import { useEffect, useRef } from 'react'
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
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || '/assets/cv/daniel-zimba-cv.pdf'
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    previouslyFocused.current = document.activeElement as HTMLElement
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    return () => previouslyFocused.current?.focus()
  }, [isOpen])

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      return activeSection === targetId
    }
    if (href === '/') return pathname === '/' && activeSection === ''
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
            aria-labelledby="mobile-navigation-title"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,24rem)] flex-col border-l border-border bg-surface-raised shadow-2xl md:hidden"
            id="mobile-navigation"
            ref={panelRef}
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-end p-6 h-[80px]">
              <h2 className="sr-only" id="mobile-navigation-title">
                Mobile navigation
              </h2>
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
