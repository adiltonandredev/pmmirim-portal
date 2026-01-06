"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface CarouselItemType {
  id: string
  title: string | null
  description: string | null
  imageUrl: string
  actionUrl: string | null
  actionText: string | null
  order: number
}

export function HeroCarousel({ items }: { items: CarouselItemType[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-slate-900 relative h-screen">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-screen">
          {items.map((slide) => (
            <CarouselItem key={slide.id} className="relative h-screen w-full">
              <div className="absolute inset-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || "Slide"}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
              </div>
              <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 text-white">
                <div className="max-w-3xl space-y-6 drop-shadow-2xl">
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/95 leading-relaxed">
                    {slide.description}
                  </p>
                  {slide.actionUrl && slide.actionText && (
                    <Link href={slide.actionUrl}>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-6 text-lg shadow-2xl hover:scale-105 transition-transform">
                        {slide.actionText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-14 h-14" />
        <CarouselNext className="hidden md:flex right-6 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 w-14 h-14" />
      </Carousel>
    </section>
  );
}