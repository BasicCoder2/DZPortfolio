import { PageWrapper } from '@/components/layout'
import { Hero } from '@/components/hero'
import { AboutSection, BlogPreviewSection, CertificationsSection, ContactSection, ExperienceSection, PhilosophySection, PricingSection, ProjectsSection, ServicesSection, TechnologiesSection } from '@/components/home/HomeSections'

/**
 * Root page — placeholder shell.
 *
 * Sections will be implemented in subsequent phases.
 */
export default function HomePage() {
  return <PageWrapper aria-label="Home page content"><Hero /><AboutSection /><ServicesSection /><PricingSection /><ProjectsSection /><PhilosophySection /><ExperienceSection /><TechnologiesSection /><CertificationsSection /><BlogPreviewSection /><ContactSection /></PageWrapper>
}
