"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

interface PostContentProps {
  html: string
  className?: string
}

export function PostContent({ html, className }: PostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  // Event delegation: um único listener no container, robusto contra re-renders
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement
        setLightbox({ src: img.src, alt: img.alt || "" })
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [html])

  // Fechar com ESC
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightbox])

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          {/* Botão fechar */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors z-10"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          {/* Imagem suspensa — stopPropagation evita fechar ao clicar na imagem */}
          <div
            className="animate-in zoom-in-90 duration-200 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
