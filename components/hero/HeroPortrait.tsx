import Image from 'next/image'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

export function HeroPortrait() {
  return (
    <MotionWrapper className="relative mx-auto w-full max-w-[31rem] lg:mx-0" variant="heroPortrait">
      <div className="relative mx-auto aspect-[720/860] w-[88%] rounded-[50%_50%_1.75rem_1.75rem] border border-accent-green/30 bg-[radial-gradient(circle_at_50%_25%,var(--color-accent-green-glow),transparent_42%),var(--surface-elevated)] lg:mx-0 lg:w-[92%]">
        {/* Sits outside the frame, so the frame itself must stay unclipped. */}
        <div
          aria-hidden="true"
          className="absolute -inset-5 rounded-[50%_50%_2.25rem_2.25rem] border border-border"
        />
        {/* The photo is a full-bleed shot on an opaque backdrop, so it fills the
            arch and is clipped by this wrapper rather than letterboxed inside it. */}
        <div className="absolute inset-0 overflow-hidden rounded-[50%_50%_1.75rem_1.75rem]">
          <Image
            fill
            priority
            alt="Daniel Zimba"
            className="object-cover object-center"
            sizes="(max-width: 1023px) 88vw, 42vw"
            src="/assets/portrait/daniel-zimba-hero.png"
          />
        </div>
      </div>
    </MotionWrapper>
  )
}
