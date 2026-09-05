'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { m } from 'framer-motion'

const SectionRevealContext = createContext(false)

/** True when an entrance animation is controlled by its containing Section. */
export function useSectionReveal(): boolean {
  return useContext(SectionRevealContext)
}

/**
 * Owns the single viewport observer for a content section.
 *
 * Its children inherit the `hidden` / `visible` variants, so a section's
 * heading, content and stagger groups begin together when the section enters
 * the viewport. `once: true` deliberately prevents replay on later visits.
 */
export function SectionReveal({ children }: { children: ReactNode }) {
  return (
    <m.div
      initial="hidden"
      variants={{ hidden: {}, visible: {} }}
      viewport={{ once: true, amount: 0.1, margin: '-24px 0px' }}
      whileInView="visible"
    >
      <SectionRevealContext.Provider value>{children}</SectionRevealContext.Provider>
    </m.div>
  )
}
