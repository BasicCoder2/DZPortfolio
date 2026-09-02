import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inlineVariants = cva('flex flex-wrap', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'start',
  },
})

interface InlineProps
  extends VariantProps<typeof inlineVariants>, React.HTMLAttributes<HTMLDivElement> {}

function Inline({ gap, align, justify, className, ...props }: InlineProps) {
  return <div className={cn(inlineVariants({ gap, align, justify }), className)} {...props} />
}

export { Inline, inlineVariants, type InlineProps }
