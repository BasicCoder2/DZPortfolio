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
