import { ImageResponse } from 'next/og'

/**
 * Apple touch icon. Apple does not accept the SVG favicon, so this renders the
 * same wordmark to a PNG at build time — no binary asset to keep in the repo.
 */
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07111f',
        color: '#35d5c3',
        fontSize: 84,
        fontWeight: 700,
        letterSpacing: '-0.05em',
      }}
    >
      DZ
    </div>,
    size
  )
}
