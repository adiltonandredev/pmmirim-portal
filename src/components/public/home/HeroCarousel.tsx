"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HeroSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  actionUrl?: string | null
  actionText?: string | null
}

export function HeroCarousel({ items }: { items: HeroSlide[] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="relative group">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            // AQUI MUDAMOS A ALTURA:
            // Mobile: h-[500px] (antes era 400)
            // Desktop: h-[700px] (antes era 500)
            <CarouselItem key={item.id} className="relative h-[500px] md:h-[700px] w-full">
              
              {/* Imagem de Fundo */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover brightness-75"
                  priority
                />
                {/* Gradiente superior para o menu */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-32"></div>
                {/* Gradiente lateral para o texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/40 to-transparent"></div>
              </div>

              {/* Conteúdo do Banner */}
              <div className="relative h-full container mx-auto px-4 flex flex-col justify-center max-w-6xl pt-20">
                <div className="max-w-2xl animate-fade-in-up">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                    {item.title}
                  </h2>
                  <p className="text-base md:text-lg text-slate-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                    {item.description}
                  </p>
                  
                  {item.actionUrl && (
                    <Link href={item.actionUrl}>
                      <Button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-6 rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-all text-lg h-14">
                        {item.actionText || "Saiba Mais"} <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Setas de navegação */}
        <div className="hidden md:block">
            <CarouselPrevious className="left-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-12 w-12" />
            <CarouselNext className="right-8 bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-12 w-12" />
        </div>
      </Carousel>
    </div>
  )
}