import { Container } from '@/components/layout/Container'
import { Brand } from './Brand'
import { Navigation } from './Navigation'
import { Socials } from './Socials'
import { Copyright } from './Copyright'
import { MotionWrapper } from '@/components/animations/MotionWrapper'

/**
 * Global application footer.
 * Composes Brand, Navigation, Socials, and Copyright elements.
 * Uses MotionWrapper to fade up when scrolled into view.
 */
export function Footer() {
  return (
    <footer className="border-t border-border mt-auto overflow-hidden">
      <MotionWrapper className="py-16 md:py-24" variant="footer">
        <Container className="flex flex-col gap-12">
          {/* Top section: Brand and Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <Brand />
            <Navigation />
          </div>

          <div aria-hidden="true" className="w-full h-px bg-border" />

          {/* Bottom section: Copyright and Socials */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <Copyright />
            <Socials />
          </div>
        </Container>
      </MotionWrapper>
    </footer>
  )
}
