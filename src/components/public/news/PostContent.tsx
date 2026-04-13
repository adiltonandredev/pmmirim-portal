"use client"

import { useEffect, useRef, useState } from "react"
import { X, ZoomIn } from "lucide-react"

interface PostContentProps {
  html: string
  className?: string
}

export function PostContent({ html, className }: PostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const images = container.querySelectorAll<HTMLImageElement>("img")

    images.forEach((img) => {
      img.style.cursor = "zoom-in"
      img.title = "Clique para ampliar"

      const open = () => setLightbox({ src: img.src, alt: img.alt || "" })
      img.addEventListener("click", open)
      // cleanup stored on the element so we can remove it later
      ;(img as any)._lightboxHandler = open
    })

    return () => {
      images.forEach((img) => {
        if ((img as any)._lightboxHandler) {
          img.removeEventListener("click", (img as any)._lightboxHandler)
          delete (img as any)._lightboxHandler
        }
        img.style.cursor = ""
        img.title = ""
      })
    }
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Botão fechar */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors backdrop-blur-sm z-10"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          {/* Imagem */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] animate-in zoom-in-90 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            {lightbox.alt && (
              <p className="text-center text-white/70 text-sm mt-3 italic">{lightbox.alt}</p>
            )}
          </div>

          {/* Dica no canto */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-white/50 text-xs">
            <ZoomIn size={12} /> Clique fora ou pressione ESC para fechar
          </div>
        </div>
      )}
    </>
  )
}
