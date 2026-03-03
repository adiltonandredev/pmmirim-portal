"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"

export function PhotoGrid({ photos }: { photos: any[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  function openModal(index: number) { setSelectedIndex(index) }
  function closeModal() { setSelectedIndex(null) }

  function nextPhoto(e?: React.MouseEvent) {
    e?.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! + 1) % photos.length)
  }

  function prevPhoto(e?: React.MouseEvent) {
    e?.stopPropagation()
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev! - 1 + photos.length) % photos.length)
  }

  // Atalhos de teclado
  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
  }

  return (
    <>
      {/* GRID DE MINIATURAS */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="relative break-inside-avoid rounded-xl overflow-hidden cursor-zoom-in group mb-4 shadow-sm border border-slate-100"
            onClick={() => openModal(index)}
          >
             <Image 
                src={photo.url} 
                alt="Galeria" 
                width={500} 
                height={500} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
             />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* MODAL (LIGHTBOX) */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200" onClick={closeModal}>
            
            {/* Botão Fechar */}
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50" onClick={closeModal}>
                <X size={32} />
            </button>

            {/* Imagem Principal */}
            <div className="relative w-full h-full max-w-7xl max-h-screen p-4 md:p-10 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <div className="relative w-full h-full">
                    <Image 
                        src={photos[selectedIndex].url} 
                        alt="Foto em tela cheia" 
                        fill 
                        className="object-contain" 
                        quality={100}
                    />
                </div>
            </div>

            {/* Navegação */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block" onClick={prevPhoto}>
                <ChevronLeft size={48} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block" onClick={nextPhoto}>
                <ChevronRight size={48} />
            </button>
            
            {/* Contador e Download */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 font-mono text-sm pointer-events-none">
                {selectedIndex + 1} / {photos.length}
            </div>
            
            <a 
                href={photos[selectedIndex].url} 
                download 
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-6 right-6 text-white/70 hover:text-white p-2 flex items-center gap-2 text-sm bg-white/10 rounded-full px-4 backdrop-blur-sm"
            >
                <Download size={16}/> Baixar
            </a>
        </div>
      )}
    </>
  )
}