'use client'

import { m, useReducedMotion } from 'framer-motion'

export function CommitGraph() {
  const reducedMotion = useReducedMotion()
  return <svg aria-hidden="true" className="h-32 w-full max-w-md text-accent-green" fill="none" viewBox="0 0 420 130"><m.path animate={{ pathLength: 1, opacity: 1 }} d="M20 30h100l55 45h100l55-45h70M175 75v35h120" initial={reducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }} stroke="currentColor" strokeWidth="2" transition={{ duration: 1.2 }} /><circle cx="20" cy="30" fill="currentColor" r="5"/><circle cx="120" cy="30" fill="currentColor" r="5"/><circle cx="175" cy="75" fill="currentColor" r="5"/><circle cx="275" cy="75" fill="currentColor" r="5"/><circle cx="330" cy="30" fill="currentColor" r="5"/><circle cx="400" cy="30" fill="currentColor" r="5"/></svg>
}
