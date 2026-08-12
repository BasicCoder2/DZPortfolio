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
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-xl border border-border bg-bg/70 p-4 font-mono text-sm text-accent-green shadow-lg"
      data-testid="terminal-motif"
    >
      <div className="mb-4 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-danger" />
        <span className="h-2 w-2 rounded-full bg-warning" />
        <span className="h-2 w-2 rounded-full bg-success" />
      </div>
      <div className="text-text-tertiary">$ dz --focus</div>
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
