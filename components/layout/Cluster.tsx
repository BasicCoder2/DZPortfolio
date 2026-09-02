import { cn } from '@/lib/utils'

interface ClusterProps {
  children: React.ReactNode
  className?: string
  gap?: 'sm' | 'md'
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
}

export function Cluster({ children, className, gap = 'md' }: ClusterProps) {
  return (
    <div className={cn('flex flex-wrap items-center', gapClasses[gap], className)}>{children}</div>
  )
}
