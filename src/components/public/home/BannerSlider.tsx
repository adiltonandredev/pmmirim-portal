// src/components/Carousel.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  id: string
  title?: string | null
  imageUrl: string
  link?: string | null
}

interface CarouselProps {
  items: CarouselItem[]
}

export function Carousel({ items }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  // Autoplay
  useEffect(() => {
    if (items.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
    }, 6000) // 6 segundos
    return () => clearInterval(timer)
  }, [items.length])

  const next = () => setCurrent((prev) => (prev + 1) % items.length)
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length)

  if (!items || items.length === 0) return null

  return (
    <div className="relative w-full h-full group">
      {/* Slides */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={item.imageUrl}
              alt={item.title || "Banner"}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay para escurecer um pouco e destacar texto se houver */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Texto/Link Opcional */}
            {(item.title || item.link) && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-4 max-w-4xl">
                        {item.title && (
                            <h2 className="text-3xl md:text-5xl font-black uppercase drop-shadow-lg mb-6 animate-fade-in-up">
                                {item.title}
                            </h2>
                        )}
                        {item.link && (
                            <Link href={item.link} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 uppercase text-sm tracking-widest">
                                Saiba Mais
                            </Link>
                        )}
                    </div>
                </div>
            )}
          </div>
        </div>
      ))}

      {/* Controles */}
      {items.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={32} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={32} />
          </button>
          
          {/* Indicadores */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === current ? "bg-white w-8" : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}