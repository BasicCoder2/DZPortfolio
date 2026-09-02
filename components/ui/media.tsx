import * as React from 'react'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  aspectRatio?: 'square' | 'video' | 'wide'
  height?: number
  src: string
  width?: number
  alt: string
}

function Image({ className, aspectRatio, height = 800, width = 1200, ...props }: ImageProps) {
  return (
    <NextImage
      {...props}
      className={cn(
        'h-full w-full object-cover',
        aspectRatio === 'square' && 'aspect-square',
        aspectRatio === 'video' && 'aspect-video',
        aspectRatio === 'wide' && 'aspect-[21/9]',
        className
      )}
      height={height}
      width={width}
    />
  )
}

export interface ResponsiveImageProps extends ImageProps {
  containerClassName?: string
}

function ResponsiveImage({ className, containerClassName, ...props }: ResponsiveImageProps) {
  return (
    <div className={cn('overflow-hidden rounded-[var(--radius-xl)]', containerClassName)}>
      <Image className={className} {...props} />
    </div>
  )
}

export interface FigureProps extends React.HTMLAttributes<HTMLElement> {
  caption?: React.ReactNode
}

function Figure({ caption, className, children, ...props }: FigureProps) {
  return (
    <figure className={cn('space-y-3', className)} {...props}>
      {children}
      {caption ? (
        <figcaption className="text-sm text-[var(--muted-foreground)]">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

export interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  language?: string
}

function CodeBlock({ className, children, language, ...props }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--foreground)]',
        className
      )}
      {...props}
    >
      {language ? (
        <code className={`language-${language}`}>{children}</code>
      ) : (
        <code>{children}</code>
      )}
    </pre>
  )
}

export { CodeBlock, Figure, Image, ResponsiveImage }
