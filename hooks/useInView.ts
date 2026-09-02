'use client'

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** IntersectionObserver threshold (0–1). Default: 0.1 */
  threshold?: number
  /** Root margin for early/late trigger. Default: '0px' */
  rootMargin?: string
  /** If true, only triggers once and then stops observing. Default: true */
  triggerOnce?: boolean
}

/**
 * Returns a ref to attach to a DOM element and a boolean indicating
 * whether the element is currently in the viewport.
 *
 * Used to trigger scroll-reveal animations via Framer Motion's
 * `animate` prop based on viewport intersection.
 *
 * @example
 * const { ref, inView } = useInView()
 * <motion.div ref={ref} animate={inView ? 'visible' : 'hidden'} />
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseInViewOptions = {}): { ref: React.RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(element)
        } else if (!triggerOnce) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, inView }
}
