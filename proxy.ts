import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next.js 16 renamed the `middleware` file convention to `proxy`. Same
 * semantics, new name — see node_modules/next/dist/docs/01-app/03-api-reference
 * /03-file-conventions/proxy.md.
 *
 * Scoped deliberately to `/admin`. The public portfolio is statically
 * prerendered and served from the CDN; running a proxy over it would put a
 * function invocation in front of every cached page for no benefit.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*'],
}
