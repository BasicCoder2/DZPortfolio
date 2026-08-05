import type { Service } from '@/types'

/**
 * Services / capability offerings.
 * Rendered under the "What I Build" section heading.
 * Icon values are Lucide icon names resolved at component render time.
 */
export const services: Service[] = [
  {
    id: 'enterprise-systems',
    title: 'Enterprise Systems',
    description:
      'Architecting and building large-scale enterprise applications that handle complexity, high throughput, and long-term maintainability.',
    icon: 'Building2',
    highlights: [
      'Scalable system architecture',
      'Microservices & API design',
      'Performance optimization',
      'Legacy system modernization',
    ],
  },
  {
    id: 'full-stack-development',
    title: 'Full Stack Development',
    description:
      'End-to-end product development from database design to polished user interfaces, with a focus on developer experience and code quality.',
    icon: 'Layers',
    highlights: [
      'Next.js & React applications',
      'REST & GraphQL APIs',
      'Database design & optimization',
      'Type-safe codebases',
    ],
  },
  {
    id: 'technical-leadership',
    title: 'Technical Leadership',
    description:
      'Guiding engineering teams through architectural decisions, code reviews, and the establishment of engineering standards that scale.',
    icon: 'Users',
    highlights: [
      'Architecture decision records',
      'Code review & mentorship',
      'Engineering standards',
      'Cross-team collaboration',
    ],
  },
]
