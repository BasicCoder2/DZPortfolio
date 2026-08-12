import Image from 'next/image'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

export function HeroPortrait() {
  return (
    <MotionWrapper className="relative mx-auto w-full max-w-[31rem] lg:mx-0" variant="heroPortrait">
      <div className="relative mx-auto aspect-[720/860] w-[88%] overflow-visible rounded-[50%_50%_1.75rem_1.75rem] border border-accent-green/30 bg-[radial-gradient(circle_at_50%_25%,rgba(124,255,79,0.12),transparent_42%),var(--surface-elevated)] lg:mx-0 lg:w-[92%]">
        <div
          aria-hidden="true"
          className="absolute -inset-5 rounded-[50%_50%_2.25rem_2.25rem] border border-border"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hero-grid rounded-[50%_50%_1.75rem_1.75rem]"
        />
        <Image
          fill
          priority
          alt="Placeholder for Daniel Zimba's professional portrait"
          className="relative h-full w-full object-contain object-center p-4 sm:p-6 lg:p-8"
          sizes="(max-width: 1023px) 88vw, 42vw"
          src="/images/portrait/daniel-zimba-hero.svg"
        />
      </div>
    </MotionWrapper>
  )
}
