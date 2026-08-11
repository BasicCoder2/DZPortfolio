'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SPRING_SMOOTH } from '@/lib/motion'

interface MotionBaseProps {
  children?: React.ReactNode
  className?: string
}

export interface FadeInProps extends MotionBaseProps {
  as?: 'div' | 'section' | 'span'
}

function StaticElement({ as = 'div', className, children }: FadeInProps) {
  return React.createElement(as, { className }, children)
}

function FadeIn({ as = 'div', className, children }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion || as !== 'div') return <StaticElement as={as} className={className}>{children}</StaticElement>
  return <motion.div animate={{ opacity: 1, y: 0 }} className={className} initial={{ opacity: 0, y: 12 }} transition={SPRING_SMOOTH}>{children}</motion.div>
}

export interface SlideInProps extends MotionBaseProps {
  direction?: 'up' | 'down' | 'left' | 'right'
}

function SlideIn({ direction = 'up', className, children }: SlideInProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  const offset = direction === 'left' ? -16 : direction === 'right' ? 16 : direction === 'down' ? 16 : -16
  return <motion.div animate={{ opacity: 1, x: 0, y: 0 }} className={className} initial={{ opacity: 0, x: direction === 'left' || direction === 'right' ? -offset : 0, y: direction === 'up' || direction === 'down' ? offset : 0 }} transition={SPRING_SMOOTH}>{children}</motion.div>
}

export type ScaleInProps = MotionBaseProps

function ScaleIn({ className, children }: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  return <motion.div animate={{ opacity: 1, scale: 1 }} className={className} initial={{ opacity: 0, scale: 0.98 }} transition={SPRING_SMOOTH}>{children}</motion.div>
}

export interface StaggerChildrenProps extends MotionBaseProps {
  children: React.ReactNode
}

function StaggerChildren({ className, children }: StaggerChildrenProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  return <motion.div className={className} initial="hidden" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }} whileInView="visible">{children}</motion.div>
}

export type RevealOnScrollProps = MotionBaseProps

function RevealOnScroll({ className, children }: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  return <motion.div animate={{ opacity: 1, y: 0 }} className={className} initial={{ opacity: 0, y: 16 }} transition={SPRING_SMOOTH} viewport={{ once: true, amount: 0.2 }} whileInView={{ opacity: 1, y: 0 }}>{children}</motion.div>
}

export type HoverLiftProps = MotionBaseProps

function HoverLift({ className, children }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  return <motion.div className={className} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>{children}</motion.div>
}

export type MagneticHoverProps = MotionBaseProps

function MagneticHover({ className, children }: MagneticHoverProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <div className={className}>{children}</div>
  return <motion.div className={className} whileHover={{ x: 0, y: -2 }}>{children}</motion.div>
}

export { FadeIn, HoverLift, MagneticHover, RevealOnScroll, ScaleIn, SlideIn, StaggerChildren }
