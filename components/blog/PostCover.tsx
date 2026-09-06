import { ContentImage } from '@/components/ui/content-image'

export function PostCover({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return (
    <ContentImage
      alt={alt}
      className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
      sizes={sizes}
      src={src}
    />
  )
}
