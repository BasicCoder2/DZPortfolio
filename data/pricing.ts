export interface PricingOption { id: string; title: string; price: string; description: string; items: string[]; recommended?: boolean }

export const pricingOptions: PricingOption[] = [
  { id: 'discovery', title: 'Discovery', price: 'Starting from $150', description: 'A focused starting point for making the problem and path forward clear.', items: ['Requirements analysis', 'Technical consultation', 'Architecture recommendations', 'Project scoping'] },
  { id: 'custom-development', title: 'Custom Development', price: 'Custom Quote', description: 'For software products that need a thoughtful, tailored build.', items: ['Business systems', 'Web applications', 'Dashboards and APIs', 'Mobile applications'], recommended: true },
  { id: 'enterprise-solutions', title: 'Enterprise Solutions', price: "Let's Discuss", description: 'For institutional systems, complex workflows, and modernization work.', items: ['Complex integrations', 'Long-term development', 'Workflow modernization', 'Technical delivery'] },
]
