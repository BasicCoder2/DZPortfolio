import { createPublicClient } from '@/lib/supabase/public'
import { CV_BUCKET } from '@/lib/media/cv'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const supabase = createPublicClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('site_cv')
      .select('path')
      .eq('id', 'current')
      .maybeSingle()
    if (error)
      return new Response('CV is temporarily unavailable. Please try again shortly.', {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      })
    if (data) {
      const { data: url } = supabase.storage
        .from(CV_BUCKET)
        .getPublicUrl(data.path, { download: 'daniel-zimba-cv.pdf' })
      return new Response(null, {
        status: 307,
        headers: { Location: url.publicUrl, 'Cache-Control': 'no-store' },
      })
    }
  }
  const fallback = process.env.NEXT_PUBLIC_RESUME_URL?.trim() || '/assets/cv/daniel-zimba-cv.pdf'
  const url = new URL(fallback, request.url)
  if (url.pathname === '/cv' || !['https:', 'http:'].includes(url.protocol)) {
    return new Response('CV is not configured.', { status: 503 })
  }
  return new Response(null, {
    status: 307,
    headers: { Location: url.toString(), 'Cache-Control': 'no-store' },
  })
}
