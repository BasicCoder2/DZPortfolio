import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-[var(--muted-foreground)]', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SpinnerProps
  extends React.SVGAttributes<SVGElement>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2 aria-hidden="true" className={cn(spinnerVariants({ size }), className)} {...props} />
  )
}

export { Spinner }




