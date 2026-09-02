'use client'

import { useEffect } from 'react'

/**
 * Locks the body scroll when active.
 * Used primarily when full-screen modals or the mobile menu are open
 * to prevent the background page from scrolling.
 *
 * @param lock - Whether the scroll should be locked.
 */
export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return

    // Save the original overflow style to restore it later
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Prevent scrolling
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    // Cleanup when component unmounts or lock becomes false
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [lock])
}
