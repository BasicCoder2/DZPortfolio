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
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Prevent scrolling
    document.body.style.overflow = 'hidden'

    // Cleanup when component unmounts or lock becomes false
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [lock])
}
