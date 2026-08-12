'use client'

import { m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { codeMarkFloatPreset, codeMarkRotatePreset } from '@/lib/motion'

export function CodeMark() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const mark = (
    <span className="signature-ambient-motion text-[clamp(2.5rem,5vw,5rem)] font-mono font-normal leading-none tracking-[-0.16em] text-accent-green/35">
      &lt; /&gt;
    </span>
  )

  if (!isMounted) {
    return (
      <div
        aria-hidden="true"
        className="signature-ambient-motion pointer-events-none absolute right-[8%] top-[8%] hidden select-none lg:block"
        data-testid="code-mark"
      >
        {mark}
      </div>
    )
  }

  return (
    <m.div
      {...codeMarkFloatPreset}
      aria-hidden="true"
      className="signature-ambient-motion pointer-events-none absolute right-[8%] top-[8%] hidden select-none lg:block"
      data-testid="code-mark"
    >
      <m.div
        {...codeMarkRotatePreset}
        className="signature-ambient-motion"
        data-testid="code-mark-rotator"
      >
        {mark}
      </m.div>
    </m.div>
  )
}
