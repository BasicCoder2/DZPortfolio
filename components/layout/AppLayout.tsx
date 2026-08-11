import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { MainContent } from './MainContent'
import { TransitionLayout } from './TransitionLayout'
import { BackToTop } from '@/components/animations/BackToTop'
import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
}

/**
 * AppLayout — The core application shell.
 * Composes the Navigation, Footer, MainContent offset, and page transitions.
 *
 * Used directly in app/layout.tsx to wrap all routes.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-bg text-text-primary selection:bg-accent-green-dim selection:text-text-primary">
      <Navigation />

      <MainContent>
        <TransitionLayout>{children}</TransitionLayout>
      </MainContent>

      <Footer />

      {/* Floating global components */}
      <BackToTop />
    </div>
  )
}
