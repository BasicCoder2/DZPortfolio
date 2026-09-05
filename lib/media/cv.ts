export const CV_BUCKET = 'content-images'
export const MAX_CV_BYTES = 3 * 1024 * 1024

export function validateCv(size: number, header: Uint8Array): string | null {
  if (size === 0) return 'Choose a PDF to upload.'
  if (size > MAX_CV_BYTES) return 'The CV must be 3 MB or smaller.'
  if (new TextDecoder().decode(header.slice(0, 5)) !== '%PDF-') return 'Choose a valid PDF file.'
  return null
}
