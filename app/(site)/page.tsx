import { PageWrapper } from '@/components/layout'
import { Hero } from '@/components/hero'
import {
  AboutSection,
  BlogPreviewSection,
  CertificationsSection,
  ContactSection,
  ExperienceSection,
  PhilosophySection,
  PricingSection,
  ProjectsSection,
  ServicesSection,
  TechnologiesSection,
} from '@/components/home/HomeSections'

/**
 * Prerendered, revalidated every five minutes.
 *
 * The literal is not an oversight: Next statically analyses route segment
 * config at build time, so `revalidate` must be a literal and an imported
 * constant is rejected outright. Keep these six routes in step by hand — they
 * are listed in docs/CONTENT_PLATFORM.md.
 *
 * The timer is only the fallback. Publishing from the admin area calls
 * revalidatePath on the affected routes immediately (lib/content/cache.ts).
 */
export const revalidate = 300

/**
 * Home page.
 *
 * Order runs identity → work → CV → commercial offer → notes → contact, so a
 * recruiter reads the whole CV block (experience, stack, certifications)
 * before being asked to read Daniel as a vendor.
 */
export default function HomePage() {
  return (
    <PageWrapper aria-label="Home page content">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <PhilosophySection />
      <ExperienceSection />
      <TechnologiesSection />
      <CertificationsSection />
      <PricingSection />
      <BlogPreviewSection />
      <ContactSection />
    </PageWrapper>
  )
}
