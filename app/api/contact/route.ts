import { contactSchema } from '@/lib/contact'

export const runtime = 'nodejs'

const submissionWindowMs = 60_000
const submissions = new Map<string, number>()

function errorResponse(message: string, status: number) {
  return Response.json({ message }, { status })
}

function getClientKey(request: Request, email: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const address = forwardedFor?.split(',')[0]?.trim() ?? 'unknown'
  return `${address}:${email.toLowerCase()}`
}

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return errorResponse('Please submit the form again.', 400)
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) return errorResponse('Please review the highlighted fields.', 400)

  const { name, email, subject, message, website } = parsed.data
  if (website) return Response.json({ message: 'Thanks — your message has been sent.' })

  const submissionKey = getClientKey(request, email)
  const lastSubmission = submissions.get(submissionKey)
  if (lastSubmission && Date.now() - lastSubmission < submissionWindowMs) {
    return errorResponse('Please wait a moment before sending another message.', 429)
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    console.error('Contact delivery is not configured.')
    return errorResponse('Unable to send your message right now. Please try again later.', 503)
  }

  submissions.set(submissionKey, Date.now())

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    })

    if (!response.ok) {
      console.error('Contact delivery provider rejected a message.', { status: response.status })
      return errorResponse('Unable to send your message right now. Please try again later.', 502)
    }
  } catch (error) {
    console.error('Contact delivery request failed.', error)
    return errorResponse('Unable to send your message right now. Please try again later.', 502)
  }

  return Response.json({ message: 'Thanks — your message has been sent.' })
}
