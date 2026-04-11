"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect } from "react"

interface HeroSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  actionUrl?: string | null
  actionText?: string | null
}

export function HeroCarousel({ items }: { items: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  if (!items || items.length === 0) return null

  return (
    <div className="relative group">
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 6000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {items.map((item, idx) => (
            <CarouselItem key={item.id} className="relative h-[520px] md:h-[720px] w-full">

              {/* Imagem de Fundo */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover brightness-70"
                  priority={idx === 0}
                />
                {/* Gradiente para legibilidade do menu */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />
                {/* Gradiente lateral para o texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/30 to-transparent" />
              </div>

              {/* Conteúdo */}
              <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-center max-w-7xl pt-24 pb-20">
                <div className="max-w-xl animate-fade-in-up">
                  {/* Pill decorativo */}
                  <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/30 backdrop-blur-sm text-yellow-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 animation-delay-100 animate-fade-in">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    Polícia Militar Mirim
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.1] drop-shadow-lg animation-delay-150 animate-fade-in-up">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-sm md:text-base text-slate-200 mb-8 leading-relaxed max-w-md font-light animation-delay-300 animate-fade-in-up">
                      {item.description}
                    </p>
                  )}

                  {item.actionUrl && item.actionText && (
                    <Link href={item.actionUrl} className="animation-delay-400 animate-fade-in-up inline-block">
                      <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black px-7 py-5 rounded-xl shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 text-sm md:text-base h-auto gap-2 group/btn hover:-translate-y-0.5">
                        {item.actionText}
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas — apenas desktop */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-6 bg-white/10 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm h-12 w-12 transition-all duration-200" />
          <CarouselNext className="right-6 bg-white/10 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm h-12 w-12 transition-all duration-200" />
        </div>
      </Carousel>

      {/* Dots de paginação */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx
                  ? "bg-yellow-400 w-7 shadow-md"
                  : "bg-white/40 hover:bg-white/70 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
