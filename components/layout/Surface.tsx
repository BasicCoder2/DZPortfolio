import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const surfaceVariants = cva(
  'rounded-xl',
  {
    variants: {
      variant: {
        default: 'bg-surface border border-border',
        raised: 'bg-surface-raised border border-border shadow-card',
        overlay: 'bg-surface-overlay border border-border shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface SurfaceProps
  extends VariantProps<typeof surfaceVariants>,
    React.HTMLAttributes<HTMLDivElement> {}

function Surface({ variant, className, ...props }: SurfaceProps) {
  return <div className={cn(surfaceVariants({ variant }), className)} {...props} />
}

export { Surface, surfaceVariants, type SurfaceProps }
