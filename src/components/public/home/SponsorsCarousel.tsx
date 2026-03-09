"use client"

import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Sponsor {
  id: string;
  title: string | null;
  imageUrl: string;
  link: string | null;
}

interface Props {
  sponsors: Sponsor[];
}

export function SponsorsCarousel({ sponsors }: Props) {
  if (!sponsors || sponsors.length === 0) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 relative group">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-6 pb-2"> {/* pb-4 dá espaço para a sombra não cortar */}
          {sponsors.map((sponsor) => (
            <CarouselItem key={sponsor.id} className="pl-6 md:basis-1/2 lg:basis-1/4">
              {/* REMOVIDO: Card e CardContent. Agora é um container limpo. */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-grab active:cursor-grabbing bg-white">
                
                {sponsor.link ? (
                    <a 
                      href={sponsor.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full h-full block relative"
                    >
                         <Image
                            src={sponsor.imageUrl}
                            alt={sponsor.title || "Patrocinador"}
                            fill
                            className="object-cover hover:scale-110 transition-transform duration-700"
                          />
                    </a>
                ) : (
                    <Image
                      src={sponsor.imageUrl}
                      alt={sponsor.title || "Patrocinador"}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                )}
                
                {/* Legenda sutil (gradiente preto apenas no rodapé da imagem) */}
                {sponsor.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full hover:translate-y-0 transition-transform duration-300 flex items-end justify-center pointer-events-none">
                        <span className="text-white font-bold text-sm tracking-wide shadow-black drop-shadow-md">{sponsor.title}</span>
                    </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Setas flutuantes modernas */}
        <CarouselPrevious className="hidden md:flex -left-2 w-12 h-12 border-none bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-blue-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="hidden md:flex -right-2 w-12 h-12 border-none bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white hover:text-blue-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>
    </div>
  )
}