import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-xl border border-border bg-surface text-text-primary', {
  variants: {
    variant: {
      default: 'shadow-card',
      elevated: 'shadow-card-elevated bg-surface-raised',
      outlined: 'border-2 border-border-strong shadow-none',
      filled: 'bg-surface-subtle border-transparent shadow-none',
    },
    interactive: {
      true: 'transition-all duration-200 hover:shadow-md hover:border-border-strong cursor-pointer',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    interactive: false,
  },
})

export interface CardProps
  extends VariantProps<typeof cardVariants>, React.HTMLAttributes<HTMLDivElement> {}

const Card = ({ variant, interactive, className, ...props }: CardProps) => (
  <div className={cn(cardVariants({ variant, interactive }), className)} {...props} />
)

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)

const CardBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
)

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: 'square' | 'video' | 'wide'
}

const CardMedia = ({ className, aspectRatio = 'wide', ...props }: CardMediaProps) => (
  <div
    className={cn(
      'relative overflow-hidden bg-surface-subtle',
      aspectRatio === 'square' && 'aspect-square',
      aspectRatio === 'video' && 'aspect-video',
      aspectRatio === 'wide' && 'aspect-[21/9]',
      className
    )}
    {...props}
  />
)

const CardActions = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center gap-2', className)} {...props} />
)

export { Card, CardHeader, CardBody, CardFooter, CardMedia, CardActions, cardVariants }
