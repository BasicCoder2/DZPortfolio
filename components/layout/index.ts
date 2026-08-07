/**
 * Layout Components
 *
 * This directory contains the structural primitives and the global application shell.
 */

export { AppLayout } from './AppLayout'
export { Container } from './Container'
export { MaxWidth } from './MaxWidth'
export { Section } from './Section'
export { MainContent } from './MainContent'
export { TransitionLayout } from './TransitionLayout'

// Export Navigation subsystem
export { Navigation, Wordmark, NavLinks, MobileMenu, CTAButton } from './Navigation'

// Export Footer subsystem
export {
  Footer,
  Brand as FooterBrand,
  Navigation as FooterNavigation,
  Socials as FooterSocials,
  Copyright as FooterCopyright,
} from './Footer'
