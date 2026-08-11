'use client'

import { m, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { codeMarkFloatPreset, codeMarkRotatePreset } from '@/lib/motion'

export function CodeMark() {
  const reducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const mark = (
    <span className="text-[clamp(2.5rem,5vw,5rem)] font-mono font-normal leading-none tracking-[-0.16em] text-[#7CFF4F]/35">
      &lt; /&gt;
    </span>
  )

  if (!isMounted || reducedMotion) {
    return <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[8%] hidden select-none lg:block">{mark}</div>
  }

  return (
    <m.div
      {...codeMarkFloatPreset}
      aria-hidden="true"
      className="pointer-events-none absolute right-[8%] top-[8%] hidden select-none lg:block"
    >
      <m.div {...codeMarkRotatePreset}>{mark}</m.div>
    </m.div>
  )
}
