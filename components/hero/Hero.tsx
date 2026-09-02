import { Container, Section } from '@/components/layout'
import { MotionWrapper } from '@/components/animations/MotionWrapper'
import { CodeMark } from './CodeMark'
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
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10" />
      <Container className="relative flex min-h-svh items-center pb-16 pt-[calc(var(--nav-h)+3rem)] md:pb-20 lg:pb-24">
        <CodeMark />
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.8fr)] lg:gap-16 xl:gap-24">
          <div className="relative z-10 max-w-3xl">
            <MotionWrapper
              className="mb-5 font-mono text-xs uppercase tracking-[0.16em] text-text-secondary sm:text-sm"
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
        <a
          aria-label="Scroll to explore more"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-text-tertiary transition-colors hover:text-text-primary sm:flex"
          href="#projects"
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em]">
            Scroll to explore
          </span>
          <span
            aria-hidden="true"
            className="h-8 w-px bg-gradient-to-b from-accent-green to-transparent"
          />
        </a>
      </Container>
    </Section>
  )
}
