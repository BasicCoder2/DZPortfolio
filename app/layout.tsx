import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import { defaultMetadata } from '@/lib/metadata'
import { Providers } from '@/components/providers/Providers'
import { AppLayout } from '@/components/layout'
import '@/app/globals.css'

export const runtime = 'nodejs'

export const metadata: Metadata = defaultMetadata

export const dynamic = 'force-static'

/**
 * Root layout — wraps every page in the application.
 *
 * Responsibilities:
 * - Applies CSS font variables to the HTML element
 * - Provides global contexts (Theme, Motion)
 * - Renders the global AppLayout shell
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={fontVariables} lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  )
}
