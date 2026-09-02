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
      'Practical systems for complex workflows, administration, reporting, and automation.',
    icon: 'Building2',
    highlights: [
      'Workflow systems',
      'Role-based applications',
      'Reporting and automation',
      'Institutional platforms',
    ],
  },
  {
    id: 'web-applications',
    title: 'Web Applications',
    description: 'Modern web platforms, business applications, portals, APIs, and dashboards.',
    icon: 'Globe2',
    highlights: [
      'React and Next.js',
      'Portals and dashboards',
      'REST APIs',
      'Maintainable interfaces',
    ],
  },
  {
    id: 'ai-solutions',
    title: 'AI Solutions',
    description:
      'AI integrations, computer vision, intelligent automation, and LLM-powered features.',
    icon: 'Sparkles',
    highlights: [
      'AI integrations',
      'Computer vision',
      'Intelligent automation',
      'LLM-powered features',
    ],
  },
  {
    id: 'mobile-applications',
    title: 'Mobile Applications',
    description:
      'Cross-platform mobile products for connected, offline-first, and operational workflows.',
    icon: 'Smartphone',
    highlights: [
      'Flutter applications',
      'Firebase-backed workflows',
      'Cross-platform interfaces',
      'Offline-first thinking',
    ],
  },
]
