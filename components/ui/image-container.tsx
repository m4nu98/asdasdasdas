"use client"

import Image from "next/image"

interface ImageContainerProps {
  src: string
  alt: string
  className?: string
}

export function ImageContainer({ src, alt, className }: ImageContainerProps) {
  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  )
} 