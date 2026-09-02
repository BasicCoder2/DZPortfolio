import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spacerVariants = cva('shrink-0', {
  variants: {
    size: {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
      '2xl': 'h-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spacerVariants> {}

function Spacer({ className, size, ...props }: SpacerProps) {
  return <div aria-hidden="true" className={cn(spacerVariants({ size }), className)} {...props} />
}

export { Spacer }
