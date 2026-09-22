import { ArrowDown } from 'lucide-react'
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
      <Container className="relative flex min-h-svh items-center pb-16 pt-[calc(var(--nav-h)+3rem)] md:pb-20 lg:pb-24">
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
        {/* Functional rather than decorative: names and links to the next
            section instead of an inert "scroll" hint with a tick line. */}
        <a
          aria-label="Go to selected work"
          className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-surface-overlay py-2 pl-4 pr-3 text-sm text-text-secondary shadow-sm backdrop-blur transition-colors hover:border-border-strong hover:text-text-primary sm:flex"
          href="#work"
        >
          Next: Selected work
          <ArrowDown
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
          />
        </a>
      </Container>
    </Section>
  )
}
