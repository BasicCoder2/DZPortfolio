import type { Technology } from '@/types'

/**
 * Technology stack — languages, frameworks, tools, platforms.
 * Ordered by category and proficiency for consistent rendering.
 */
export const technologies: Technology[] = [
  // Languages
  { name: 'TypeScript', category: 'language', proficiency: 'expert' },
  { name: 'JavaScript', category: 'language', proficiency: 'expert' },
  { name: 'Python', category: 'language', proficiency: 'advanced' },
  { name: 'SQL', category: 'language', proficiency: 'expert' },
  { name: 'Go', category: 'language', proficiency: 'intermediate' },

  // Frameworks
  { name: 'Next.js', category: 'framework', proficiency: 'expert' },
  { name: 'React', category: 'framework', proficiency: 'expert' },
  { name: 'Node.js', category: 'framework', proficiency: 'expert' },
  { name: 'Express', category: 'framework', proficiency: 'advanced' },
  { name: 'Fastify', category: 'framework', proficiency: 'advanced' },

  // Databases
  { name: 'PostgreSQL', category: 'database', proficiency: 'expert' },
  { name: 'MySQL', category: 'database', proficiency: 'advanced' },
  { name: 'Redis', category: 'database', proficiency: 'advanced' },
  { name: 'MongoDB', category: 'database', proficiency: 'intermediate' },

  // Cloud
  { name: 'AWS', category: 'cloud', proficiency: 'advanced' },
  { name: 'Vercel', category: 'cloud', proficiency: 'expert' },
  { name: 'Docker', category: 'cloud', proficiency: 'advanced' },

  // Tools
  { name: 'Git', category: 'tool', proficiency: 'expert' },
  { name: 'GitHub Actions', category: 'tool', proficiency: 'advanced' },
  { name: 'Prisma', category: 'tool', proficiency: 'expert' },
  { name: 'tRPC', category: 'tool', proficiency: 'advanced' },
]

/**
 * Returns technologies filtered by category.
 */
export function getTechnologiesByCategory(category: Technology['category']): Technology[] {
  return technologies.filter((t) => t.category === category)
}
