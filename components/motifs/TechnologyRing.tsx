'use client'

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const technologies = ['Laravel', 'React', 'Flutter', 'Python', 'Next.js', 'TypeScript / AI']

export function TechnologyRing() {
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return <div aria-hidden="true" className="relative mx-auto h-64 w-64"><m.div animate={mounted && !reducedMotion ? { rotate: 360 } : undefined} className="absolute inset-0 rounded-full border border-accent-green/30" initial={{ rotate: 0 }} transition={{ duration: 28, ease: 'linear', repeat: Infinity }}>
    {technologies.map((technology, index) => { const angle = (360 / technologies.length) * index; return <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs text-text-secondary" key={technology} style={{ transform: `rotate(${angle}deg) translateY(-7.5rem) rotate(-${angle}deg)` }}>{technology}</span> })}
  </m.div><div className="absolute inset-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent-green/40 bg-surface-elevated font-heading text-2xl font-bold text-accent-green">DZ</div></div>
}
