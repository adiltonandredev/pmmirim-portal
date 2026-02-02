"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface Banner {
  id: string
  imageUrl: string
  title: string | null
  link: string | null
}

interface PartnersCarouselProps {
  banners: Banner[]
}

export function PartnersCarousel({ banners }: PartnersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotação Automática (5 segundos)
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, banners.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (banners.length === 0) return null

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl bg-white border border-slate-100 group">
      
      {/* Container das Imagens */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[400px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative h-full">
            {/* Se tiver link, o banner é clicável */}
            {banner.link ? (
               <Link href={banner.link} target="_blank" className="relative w-full h-full block">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title || "Parceiro"}
                    fill
                    className="object-cover"
                  />
                  {/* Badge de Link Externo */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-900 flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                     Visitar Site <ExternalLink size={12} />
                  </div>
               </Link>
            ) : (
               <Image
                  src={banner.imageUrl}
                  alt={banner.title || "Parceiro"}
                  fill
                  className="object-cover"
               />
            )}
          </div>
        ))}
      </div>

      {/* Controles (Só aparecem se tiver mais de 1 banner) */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores (Bolinhas) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}