/**
 * SUPERSEDED — no longer read by the application.
 *
 * Experience entries now live in the Supabase `experience_entries` table and are edited at
 * `/admin/experience`. This file is kept only as the pre-migration record; its
 * frozen contents were copied into `scripts/legacy-content.json`, which is
 * what `pnpm content:import` actually reads.
 *
 * Deleting it is a separate, reviewable change, to be made once the
 * database has been populated and parity confirmed on the live site. Until
 * then it is the only reference for what the site used to say.
 */
import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    id: 'lmmu',
    company: 'Levy Mwanawasa Medical University',
    role: 'Software Developer',
    period: 'Details pending confirmation',
    highlights: ['Enterprise systems and institutional software delivery.'],
    technologies: ['Laravel', 'React', 'MySQL'],
  },
  {
    id: 'fase',
    company: 'FASE-related software and web work',
    role: 'Software Developer',
    period: 'Details pending confirmation',
    highlights: ['Web platforms, membership workflows, and digital operations.'],
    technologies: ['PHP', 'WordPress', 'JavaScript'],
  },
]
