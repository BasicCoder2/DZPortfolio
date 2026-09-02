import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Image } from './media'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)]',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-14 w-14 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src ? (
        <Image alt={alt ?? ''} className="h-full w-full object-cover" src={src} />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[var(--muted-foreground)]">
          {fallback}
        </div>
      )}
    </div>
  )
}

export { Avatar, avatarVariants }
