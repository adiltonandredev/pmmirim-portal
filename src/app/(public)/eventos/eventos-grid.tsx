"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock, X, ArrowRight } from "lucide-react"
import { Event } from "@prisma/client"

interface EventosGridProps {
  events: Event[]
}

export function EventosGrid({ events }: EventosGridProps) {
  const [selected, setSelected] = useState<Event | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => {
          const eventDate = new Date(event.date)
          const day = eventDate.getDate()
          const month = eventDate.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()
          const time = eventDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          const weekday = eventDate.toLocaleDateString("pt-BR", { weekday: "long" })

          return (
            <article
              key={event.id}
              onClick={() => setSelected(event)}
              className="group cursor-pointer h-full"
            >
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full bg-white rounded-2xl">

                {/* IMAGEM / BANNER */}
                <div className="h-56 relative bg-slate-800 overflow-hidden">
                  {event.bannerUrl ? (
                    <Image
                      src={event.bannerUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <CalendarDays className="text-slate-300" size={48} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* BADGE DE DATA */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg overflow-hidden text-center min-w-[60px] border border-slate-100">
                    <div className="bg-blue-600 text-white text-[10px] font-bold uppercase py-1 px-2">{month}</div>
                    <div className="py-2 px-2">
                      <span className="text-2xl font-black text-slate-900 leading-none block">{day}</span>
                    </div>
                  </div>

                  {/* TAG DE LOCAL */}
                  {event.location && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-xs font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <MapPin size={12} className="text-blue-400" />
                      <span className="truncate max-w-[200px]">{event.location}</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-2 tracking-wide">
                      <Clock size={14} />
                      {weekday} às {time}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors mb-2">
                      {event.title}
                    </h3>
                  </div>

                  {event.description && (
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 text-justify flex-1">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
                      Saiba mais <ArrowRight size={14} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </article>
          )
        })}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-red-500 rounded-full shadow-md transition-colors"
            >
              <X size={22} />
            </button>

            {/* Banner */}
            {selected.bannerUrl && (
              <div className="relative w-full h-52 sm:h-64 rounded-t-3xl overflow-hidden bg-slate-200">
                <Image src={selected.bannerUrl} alt={selected.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-5">
              {/* Badge + Título */}
              <div className="text-center">
                <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100 mb-3">
                  Evento
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {selected.title}
                </h2>
              </div>

              {/* Data, Hora e Local */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                  <CalendarDays size={20} className="text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Data &amp; Hora</p>
                    <p className="text-sm font-bold text-slate-800 capitalize">
                      {new Date(selected.date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-slate-500">
                      às {new Date(selected.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                {selected.location && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <MapPin size={20} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Local</p>
                      <p className="text-sm font-bold text-slate-800">{selected.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição completa */}
              {selected.description && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selected.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
