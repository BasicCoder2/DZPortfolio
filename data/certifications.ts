/**
 * SUPERSEDED — no longer read by the application.
 *
 * Certifications now live in the Supabase `certifications` table and are edited at
 * `/admin/certifications`. This file is kept only as the pre-migration record; its
 * frozen contents were copied into `scripts/legacy-content.json`, which is
 * what `pnpm content:import` actually reads.
 *
 * Deleting it is a separate, reviewable change, to be made once the
 * database has been populated and parity confirmed on the live site. Until
 * then it is the only reference for what the site used to say.
 */
import type { Certification } from '@/types'

export const certifications: Certification[] = [
  { title: 'Huawei AI', issuer: 'Huawei', issueDate: 'Details pending confirmation' },
  { title: 'Huawei Cloud Computing', issuer: 'Huawei', issueDate: 'Details pending confirmation' },
  { title: 'AI learning credentials', issuer: 'Kaggle', issueDate: 'Details pending confirmation' },
]
