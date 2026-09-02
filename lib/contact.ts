import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100, 'Name is too long.'),
  email: z.string().trim().email('Please enter a valid email.').max(254, 'Email is too long.'),
  subject: z.string().trim().min(3, 'Please add a subject.').max(160, 'Subject is too long.'),
  message: z.string().trim().min(10, 'Please add a little more detail.').max(5000, 'Message is too long.'),
  website: z.string().max(0).optional(),
})

export type ContactFormValues = z.infer<typeof contactSchema>
