'use client'

import Image from 'next/image'
import { useState } from 'react'

type ContentImageProps = {
  src: string
  alt: string
  sizes: string
  className?: string
  fill?: boolean
  priority?: boolean
}

/** Reset recovery when a saved image changes, without waiting for navigation. */
export function ContentImage(props: ContentImageProps) {
  return <ImageWithRecovery key={props.src} {...props} />
}

function ImageWithRecovery({ src, alt, sizes, className, priority }: ContentImageProps) {
  const [mode, setMode] = useState<'optimized' | 'original' | 'failed'>('optimized')
  const [attempt, setAttempt] = useState(0)

  if (mode === 'failed') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface-muted px-4 text-center">
        <span aria-hidden="true" className="font-mono text-4xl text-accent-green/40">
          {'<DZ />'}
        </span>
        <span className="text-sm text-text-secondary" role="status">
          Image temporarily unavailable
        </span>
        <button
          className="rounded-md border border-border-strong px-3 py-2 text-sm text-text-primary hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setAttempt((value) => value + 1)
            setMode('original')
          }}
        >
          Retry image
        </button>
      </div>
    )
  }

  return (
    <Image
      fill
      alt={alt}
      className={className}
      key={`${mode}-${attempt}`}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      src={src}
      unoptimized={mode === 'original'}
      onError={() => setMode(mode === 'optimized' ? 'original' : 'failed')}
    />
  )
}
