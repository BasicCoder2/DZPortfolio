import { Container, Section } from '@/components/layout'
import { MotionWrapper } from '@/components/animations/MotionWrapper'
import { CodeMark } from './CodeMark'
import { HeroActions } from './HeroActions'
import { HeroPortrait } from './HeroPortrait'

export function Hero() {
  return (
    <Section className="relative isolate overflow-hidden !py-0" id="home">
      <div aria-hidden="true" className="hero-canvas absolute inset-0 -z-20" />
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10" />
      <Container className="relative flex min-h-[calc(100svh-5rem)] items-center py-12 md:py-16 lg:min-h-[calc(100svh-5.5rem)] lg:py-20">
        <CodeMark />
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.8fr)] lg:gap-16 xl:gap-24">
          <div className="relative z-10 max-w-3xl">
            <MotionWrapper className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-text-secondary sm:text-sm" variant="heroEyebrow">
              Daniel Zimba
            </MotionWrapper>
            <MotionWrapper as="h1" className="max-w-[10ch] text-display font-heading uppercase text-text-primary" variant="heroTitle">
              Software Developer
            </MotionWrapper>
            <MotionWrapper as="p" className="mt-7 max-w-[30ch] text-[clamp(1.35rem,2.3vw,2.15rem)] font-medium leading-[1.12] tracking-[-0.03em] text-text-primary" variant="heroStatement">
              Building enterprise systems, AI-powered applications and digital products.
            </MotionWrapper>
            <MotionWrapper as="p" className="mt-6 max-w-[56ch] text-base leading-7 text-text-secondary md:text-lg" variant="heroBody">
              I build thoughtful software solutions for businesses and institutions, combining modern web technologies, AI, and practical engineering to solve real-world problems.
            </MotionWrapper>
            <HeroActions />
          </div>
          <HeroPortrait />
        </div>
        <a aria-label="Scroll to explore more" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-text-tertiary transition-colors hover:text-text-primary sm:flex" href="#projects">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">Scroll to explore</span>
          <span aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-accent-green to-transparent" />
        </a>
      </Container>
    </Section>
  )
}
