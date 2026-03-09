"use client"

import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Handshake } from "lucide-react"

interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
  siteUrl: string;
}

interface Props {
  partners: Partner[];
}

export function PartnersAutoCarousel({ partners }: Props) {
  if (!partners || partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
        <Handshake size={48} className="mb-4 opacity-30" />
        <p className="font-medium">Espaço reservado para parceiros</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          loop: true,   // Loop infinito
          align: "center",
        }}
        plugins={[
          Autoplay({
            delay: 5000, // Troca a cada 5 segundos
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
      >
        {/* A margem negativa (-ml-0) remove espaçamentos indesejados */}
        <CarouselContent className="ml-0">
          {partners.map((partner) => (
            // basis-full obriga o item a ocupar 100% da largura (1 por vez)
            <CarouselItem key={partner.id} className="pl-0 basis-full">
              
              <Link 
                  href={partner.siteUrl && partner.siteUrl !== "#" ? partner.siteUrl : "#"} 
                  target={partner.siteUrl && partner.siteUrl !== "#" ? "_blank" : "_self"}
                  className="block w-full h-full relative group"
              >
                {/* Define a altura do banner. 
                   aspect-[3/1] em mobile e aspect-[4/1] em desktop mantém o formato retangular de banner 
                   Ajuste 'h-[250px] md:h-[400px]' se preferir altura fixa.
                */}
                <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                  {partner.logoUrl ? (
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      priority={false}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-400">
                        <Handshake size={48} className="mb-2" />
                        <span className="font-bold">{partner.name}</span>
                    </div>
                  )}

                  {/* Legenda opcional (aparece ao passar o mouse) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                        Visitar Site
                      </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}