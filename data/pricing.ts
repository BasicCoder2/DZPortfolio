/**
 * SUPERSEDED — no longer read by the application.
 *
 * Engagement pricing tiers now live in the Supabase `engagement_options` table and are edited at
 * `/admin/engagement`. This file is kept only as the pre-migration record; its
 * frozen contents were copied into `scripts/legacy-content.json`, which is
 * what `pnpm content:import` actually reads.
 *
 * Deleting it is a separate, reviewable change, to be made once the
 * database has been populated and parity confirmed on the live site. Until
 * then it is the only reference for what the site used to say.
 */
export interface PricingOption {
  id: string
  title: string
  price: string
  description: string
  items: string[]
  recommended?: boolean
}

export const pricingOptions: PricingOption[] = [
  {
    id: 'discovery',
    title: 'Discovery',
    price: 'Starting from $150',
    description: 'A focused starting point for making the problem and path forward clear.',
    items: [
      'Requirements analysis',
      'Technical consultation',
      'Architecture recommendations',
      'Project scoping',
    ],
  },
  {
    id: 'custom-development',
    title: 'Custom Development',
    price: 'Custom Quote',
    description: 'For software products that need a thoughtful, tailored build.',
    items: ['Business systems', 'Web applications', 'Dashboards and APIs', 'Mobile applications'],
    recommended: true,
  },
  {
    id: 'enterprise-solutions',
    title: 'Enterprise Solutions',
    price: "Let's Discuss",
    description: 'For institutional systems, complex workflows, and modernization work.',
    items: [
      'Complex integrations',
      'Long-term development',
      'Workflow modernization',
      'Technical delivery',
    ],
  },
]
