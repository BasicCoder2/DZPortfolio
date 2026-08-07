import { Container, Section } from '@/components/layout'
import { MotionWrapper } from '@/components/animations/MotionWrapper'
import { RevealText } from '@/components/animations/RevealText'

/**
 * Root page — placeholder shell.
 *
 * Sections will be implemented in subsequent phases.
 */
export default function HomePage() {
  return (
    <Container size="default">
      <Section className="min-h-[80vh] flex flex-col justify-center" id="home">
        <MotionWrapper className="max-w-3xl" variant="fadeUp">
          <RevealText as="h1" className="text-h1 mb-6" text="Daniel Zimba. Software Engineer." />
        </MotionWrapper>
      </Section>

      <Section className="min-h-screen" id="about">
        {/* Placeholder for scrolling/active state testing */}
        <h2 className="text-h2">About</h2>
      </Section>

      <Section className="min-h-screen" id="services">
        <h2 className="text-h2">What I Build</h2>
      </Section>

      <Section className="min-h-screen" id="projects">
        <h2 className="text-h2">Projects</h2>
      </Section>

      <Section className="min-h-[50vh]" id="contact">
        <h2 className="text-h2">Contact</h2>
      </Section>
    </Container>
  )
}
