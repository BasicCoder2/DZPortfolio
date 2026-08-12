import { ArrowUpRight, Download } from 'lucide-react'
import Link from 'next/link'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

const actionBase =
  'inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2'

export function HeroActions() {
  return (
    <MotionWrapper className="flex flex-col gap-3 sm:flex-row" variant="heroActions">
      <Link
        className={`${actionBase} bg-accent-green text-[#07111f] shadow-sm hover:brightness-110 group`}
        href="/#projects"
      >
        View Projects
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
      <a
        download
        className={`${actionBase} border border-border-strong text-text-primary hover:bg-surface-muted group`}
        href="/cv/daniel-zimba-cv.pdf"
      >
        Download CV
        <Download
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
        />
      </a>
    </MotionWrapper>
  )
}
