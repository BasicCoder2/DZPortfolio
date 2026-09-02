import { cn } from '@/lib/utils'

interface AutoGridProps {
  children: React.ReactNode
  className?: string
  minWidth?: string
  gap?: 'sm' | 'md' | 'lg'
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export function AutoGrid({ children, className, minWidth = '280px', gap = 'md' }: AutoGridProps) {
  return (
    <div
      className={cn(
        'grid',
        'grid-cols-[repeat(auto-fill,minmax(var(--auto-grid-min,280px),1fr))]',
        gapClasses[gap],
        className
      )}
      style={{ '--auto-grid-min': minWidth } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
