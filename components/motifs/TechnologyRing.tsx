'use client'

import { m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { technologyRingCounterRotatePreset, technologyRingRotatePreset } from '@/lib/motion'

const technologies = ['Laravel', 'React', 'Flutter', 'Python', 'Next.js', 'TypeScript']

/**
 * Orbit radius for the labels, in rem.
 *
 * Because labels now stay upright while they orbit, the binding case is a word
 * at 3 or 9 o'clock, where its full width points radially outward — not the
 * tangential case at the top. Clearance therefore needs `orbit + widestLabel/2`
 * to stay inside the ring: at 9rem radius that caps the orbit at 6.375rem,
 * which also leaves 26px between the longest label and the centre hub.
 */
const LABEL_ORBIT_REM = 6.375

export function TechnologyRing() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <div aria-hidden="true" className="relative mx-auto h-72 w-72" data-testid="technology-ring">
      <m.div
        {...technologyRingRotatePreset}
        animate={mounted ? technologyRingRotatePreset.animate : undefined}
        className="signature-ambient-motion absolute inset-0 rounded-full border border-accent-green/30"
      >
        <div className="absolute inset-0">
          {technologies.map((technology, index) => {
            const angle = (360 / technologies.length) * index
            return (
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs text-text-secondary"
                key={technology}
                style={{
                  // Place on the orbit, then undo the placement rotation so the
                  // word starts upright.
                  transform: `rotate(${angle}deg) translateY(-${LABEL_ORBIT_REM}rem) rotate(-${angle}deg)`,
                }}
              >
                {/* Cancels the ring's own spin. Without this the labels rotate
                    rigidly with the ring and pass through upside down — the
                    border and hub carry the motion instead. */}
                <m.span
                  {...technologyRingCounterRotatePreset}
                  animate={mounted ? technologyRingCounterRotatePreset.animate : undefined}
                  className="signature-ambient-motion block"
                >
                  {technology}
                </m.span>
              </span>
            )
          })}
        </div>
      </m.div>
      <div className="absolute inset-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-green/40 bg-surface-elevated font-heading text-2xl font-bold text-accent-green">
        DZ
      </div>
    </div>
  )
}
