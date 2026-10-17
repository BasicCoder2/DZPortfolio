import { Container, Section } from '@/components/layout'
import { MotionWrapper } from '@/components/animations/MotionWrapper'
import { HeroActions } from './HeroActions'
import { HeroPortrait } from './HeroPortrait'

export function Hero() {
  return (
    <Section
      data-nav-section
      className="relative isolate -mt-[var(--nav-h)] overflow-hidden !py-0"
      id="home"
    >
      <div aria-hidden="true" className="hero-canvas absolute inset-0 -z-20" />
      <Container className="relative flex min-h-svh items-center pb-12 pt-[calc(var(--nav-h)+3rem)]">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.8fr)] lg:gap-16 xl:gap-24">
          <div className="relative z-10 max-w-3xl">
            <MotionWrapper
              as="p"
              className="mb-4 font-heading text-lg italic text-text-secondary sm:text-xl"
              variant="heroEyebrow"
            >
              Daniel Zimba
            </MotionWrapper>
            <MotionWrapper
              as="h1"
              className="max-w-[10ch] text-display font-heading uppercase text-text-primary"
              variant="heroTitle"
            >
              Software Developer
            </MotionWrapper>
            {/* One supporting line, set below the headline's weight so only the
                h1 reads as a headline. */}
            <MotionWrapper
              as="p"
              className="mt-7 max-w-[34ch] text-[clamp(1.25rem,2vw,1.75rem)] font-normal leading-[1.25] tracking-[-0.02em] text-text-secondary"
              variant="heroStatement"
            >
              Building enterprise systems, AI-powered applications and digital products.
            </MotionWrapper>
            <HeroActions />
          </div>
          <HeroPortrait />
        </div>
      </Container>
    </Section>
  )
}
