import type { Metadata } from 'next'
import { fontVariables } from '@/lib/fonts'
import { defaultMetadata } from '@/lib/metadata'
import { Providers } from '@/components/providers/Providers'
import '@/app/globals.css'

export const runtime = 'nodejs'

export const metadata: Metadata = defaultMetadata

/**
 * Root layout — wraps every route in the application.
 *
 * Responsibilities:
 * - Applies CSS font variables to the HTML element
 * - Provides global contexts (Theme, Motion)
 *
 * The public chrome (navigation, footer, transitions) lives one level down in
 * app/(site)/layout.tsx, because the admin area needs a different shell.
 *
 * There is deliberately **no `export const dynamic = 'force-static'` here.**
 * It used to be, and it is incompatible with authentication: `force-static` on
 * a layout forces `cookies()` to return empty values for that segment and
 * everything beneath it, so every admin route would have seen an anonymous
 * session no matter who was signed in. Removing it costs the public pages
 * nothing — they use no dynamic APIs, so Next still prerenders them, and the
 * content routes additionally opt into ISR via their own `revalidate` export.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={fontVariables} lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
