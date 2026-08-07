import { cn } from '@/lib/utils'
import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type TextAs = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'blockquote' | 'code' | 'pre' | 'small' | 'caption' | 'display' | 'display-lg' | 'lead' | 'body-lg' | 'body-sm' | 'overline' | 'quote' | 'mono' | 'body'

const textStyles: Record<string, string> = {
  display: 'text-display font-heading font-bold leading-[1.05] tracking-tight',
  'display-lg': 'text-display-lg font-heading font-bold leading-[1.05] tracking-tight',
  h1: 'text-h1 font-heading font-bold leading-[1.1] tracking-tight',
  h2: 'text-h2 font-heading font-bold leading-[1.15] tracking-tight',
  h3: 'text-h3 font-heading font-semibold leading-[1.2] tracking-tight',
  h4: 'text-h4 font-heading font-semibold leading-[1.25] tracking-tight',
  h5: 'text-h5 font-heading font-semibold leading-[1.3]',
  h6: 'text-h6 font-heading font-semibold leading-[1.35]',
  lead: 'text-lead',
  'body-lg': 'text-body-lg',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  small: 'text-small',
  caption: 'text-caption text-text-secondary',
  overline: 'text-overline',
  label: 'text-label',
  quote: 'text-quote font-heading font-semibold text-primary',
  code: 'text-code font-mono text-text-primary',
  mono: 'text-mono font-mono',
}

const colorStyles: Record<string, string> = {
  default: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  primary: 'text-primary',
  accent: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  inverse: 'text-text-inverse',
}

const weightStyles: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

interface TextProps {
  as?: TextAs | ElementType
  color?: keyof typeof colorStyles
  weight?: keyof typeof weightStyles
  align?: keyof typeof alignStyles
  truncate?: boolean
  children?: ReactNode
  className?: string
  id?: string
}

function Text({
  as = 'p',
  color = 'default',
  weight,
  align = 'left',
  truncate,
  className,
  children,
  id,
  ...props
}: TextProps & ComponentPropsWithoutRef<ElementType>) {
  const asStr = String(as)
  const baseClasses = textStyles[asStr] || ''
  const classes = cn(
    baseClasses,
    colorStyles[color],
    weight ? weightStyles[weight] : undefined,
    alignStyles[align],
    truncate ? 'truncate' : undefined,
    className
  )

  if (asStr === 'display' || asStr === 'display-lg') {
    return (
      <div className={classes} id={id} {...props}>
        {children}
      </div>
    )
  }

  const Tag = asStr as ElementType

  return (
    <Tag className={classes} id={id} {...props}>
      {children}
    </Tag>
  )
}

export { Text, type TextProps, type TextAs }
