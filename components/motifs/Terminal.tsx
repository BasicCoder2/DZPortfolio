'use client'

import { useEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'

const commands = ['Laravel_', 'React_', 'Flutter_', 'Python_', 'AI_']

export function Terminal() {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(commands.length - 1)
  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % commands.length), 2200)
    return () => window.clearInterval(timer)
  }, [reducedMotion])
  return (
    // Uses the theme-invariant code tokens rather than the page palette: a
    // terminal that inverts to white on a light page stops reading as a
    // terminal. On light it becomes a deliberate dark island; on dark it looks
    // as it always has.
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-xl border border-[var(--code-border)] bg-[var(--code-surface)] p-5 font-mono text-sm text-[var(--code-accent)] shadow-lg"
      data-testid="terminal-motif"
    >
      <div className="mb-5 flex gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="text-[var(--code-muted)]">$ dz --focus</div>
      <m.div
        animate={{ opacity: 1, y: 0 }}
        initial={reducedMotion ? false : { opacity: 0, y: 4 }}
        key={commands[index]}
        transition={{ duration: 0.25 }}
      >
        {commands[index]}
      </m.div>
    </div>
  )
}
