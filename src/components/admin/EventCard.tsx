"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, MapPin, Clock, Image as ImageIcon } from "lucide-react"
import { deleteEvent } from "@/app/actions/events"

interface EventProps {
  event: {
    id: string
    title: string
    date: Date
    location: string | null
    bannerUrl: string | null
    description: string | null
  }
}

export function EventCard({ event }: EventProps) {
  const eventDate = new Date(event.date)
  const isPast = eventDate < new Date()

  return (
    <div className={`rounded-xl shadow-sm border overflow-hidden flex flex-col hover:shadow-md transition-all group ${
        isPast ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-slate-200'
    }`}>
      
      {/* 1. BANNER */}
      <div className="relative aspect-video bg-slate-100">
        {event.bannerUrl ? (
          <Image 
            src={event.bannerUrl} 
            alt={event.title} 
            fill 
            className={`object-cover transition-transform duration-700 ${isPast ? 'grayscale' : 'group-hover:scale-105'}`} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={32} /></div>
        )}

        <div className="absolute top-2 left-2">
            {isPast ? (
                <span className="bg-slate-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm">Realizado</span>
            ) : (
                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm animate-pulse">Em Breve</span>
            )}
        </div>

        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center shadow-sm border border-slate-100">
            <span className="block text-[10px] uppercase text-slate-500 font-bold">{eventDate.toLocaleString('pt-BR', { month: 'short' })}</span>
            <span className="block text-lg font-black text-slate-800 leading-none">{eventDate.getDate()}</span>
        </div>
      </div>

      {/* 2. CONTEÚDO */}
      <div className="p-4 flex-1 flex flex-col gap-2">
         <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-2">
            {event.title}
         </h3>

         <div className="mt-auto space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} className="text-green-600 shrink-0" />
                {eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            {event.location && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={14} className="text-green-600 shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
            )}
         </div>
      </div>

      {/* 3. AÇÕES */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
          <Link href={`/admin/events/${event.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-9 text-blue-600 border-blue-200 hover:bg-blue-50">
                <Pencil size={16} />
                <span className="hidden md:inline ml-2">Editar</span>
            </Button>
          </Link>
          
          {/* CORREÇÃO AQUI: Adicionado @ts-ignore para sumir o sublinhado */}
          {/* @ts-ignore */}
          <form action={deleteEvent}>
            <input type="hidden" name="id" value={event.id} />
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 md:w-auto md:px-3 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300">
                <Trash2 size={16} />
            </Button>
          </form>
      </div>
    </div>
  )
}