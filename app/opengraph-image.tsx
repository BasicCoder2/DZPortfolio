import { ImageResponse } from 'next/og'
import { siteConfig } from '@/data/site'

/**
 * Default Open Graph card, rendered to PNG at build time.
 *
 * Generated rather than stored so it stays in step with `siteConfig` and needs
 * no binary in the repo — the same approach as app/apple-icon.tsx. Next wires
 * the meta tags up via the file convention, so nothing references a path.
 *
 * Colours are the dark theme's, hardcoded: this renders on a server with no
 * stylesheet, and a share card should look the same regardless of the viewer's
 * theme anyway.
 */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${siteConfig.author.name} — ${siteConfig.author.role}`

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#07111f',
        padding: '72px 80px',
      }}
    >
      {/* Accent rule, echoing the scroll-progress bar on the site */}
      <div style={{ display: 'flex', width: 160, height: 6, background: '#35d5c3' }} />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 30,
            letterSpacing: '0.18em',
            color: '#8fa0b8',
            textTransform: 'uppercase',
          }}
        >
          {siteConfig.author.name}
        </div>
        <div
          style={{
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#f5f7fb',
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          {siteConfig.author.role}
        </div>
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.35,
            color: '#8fa0b8',
            marginTop: 28,
            maxWidth: 880,
          }}
        >
          Building enterprise systems, AI-powered applications and digital products.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 28, color: '#35d5c3' }}>
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#35d5c3', letterSpacing: '-0.04em' }}>
          DZ
        </div>
      </div>
    </div>,
    size
  )
}
