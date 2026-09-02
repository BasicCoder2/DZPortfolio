'use client'

import { m, useReducedMotion } from 'framer-motion'

const DRAW_SECONDS = 1.6

/**
 * Nodes in the order the line reaches them.
 *
 * `at` is that moment as a fraction of the total path length, so a node lights
 * exactly as the line arrives rather than on an eyeballed stagger. The final
 * entry is the open branch tip — the line used to end there with no node, which
 * read as an unfinished stroke.
 */
interface GraphNode {
  cx: number
  cy: number
  /** Fraction of the total path length at which the line reaches this node. */
  at: number
  /** Marks the open branch tip, which keeps a slow ping. */
  live?: boolean
}

const NODES: GraphNode[] = [
  { cx: 20, cy: 30, at: 0 },
  { cx: 120, cy: 30, at: 0.176 },
  { cx: 175, cy: 75, at: 0.302 },
  { cx: 275, cy: 75, at: 0.478 },
  { cx: 330, cy: 30, at: 0.603 },
  { cx: 400, cy: 30, at: 0.727 },
  { cx: 295, cy: 110, at: 1, live: true },
]

export function CommitGraph() {
  const reducedMotion = useReducedMotion()

  // Replay the reveal when the graph is scrolled to. It sits far below the
  // fold, so animating on mount meant the draw-in always finished unseen.
  const viewport = { once: true, amount: 0.6 } as const

  return (
    <svg
      aria-hidden="true"
      className="h-32 w-full max-w-md text-accent-green"
      data-testid="commit-graph"
      fill="none"
      viewBox="0 0 420 130"
    >
      <m.path
        d="M20 30h100l55 45h100l55-45h70M175 75v35h120"
        initial={reducedMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        transition={{ duration: reducedMotion ? 0 : DRAW_SECONDS, ease: 'easeInOut' }}
        viewport={viewport}
        whileInView={{ pathLength: 1, opacity: 1 }}
      />

      {NODES.map((node) => (
        <g key={`${node.cx},${node.cy}`}>
          {/* A single slow ping on the open branch, and only there: it marks
              work still in flight. Every node pulsing would be noise. */}
          {node.live && !reducedMotion && (
            <m.circle
              animate={{ r: [5, 13], opacity: [0.5, 0] }}
              cx={node.cx}
              cy={node.cy}
              fill="none"
              // `r` must have a concrete starting value: animating it from
              // undefined makes SVG reject the attribute on the first frame.
              initial={{ r: 5, opacity: 0 }}
              r={5}
              stroke="currentColor"
              strokeWidth="1.5"
              transition={{
                duration: 2.4,
                ease: 'easeOut',
                repeat: Infinity,
                delay: DRAW_SECONDS,
                repeatDelay: 0.6,
              }}
            />
          )}
          <m.circle
            cx={node.cx}
            cy={node.cy}
            fill="currentColor"
            initial={reducedMotion ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            r="5"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    // Land as the line arrives, then settle with a slight
                    // overshoot so each node reads as a decision clicking in.
                    delay: node.at * DRAW_SECONDS,
                    type: 'spring',
                    stiffness: 500,
                    damping: 18,
                  }
            }
            viewport={viewport}
            whileInView={{ scale: 1, opacity: 1 }}
          />
        </g>
      ))}
    </svg>
  )
}
