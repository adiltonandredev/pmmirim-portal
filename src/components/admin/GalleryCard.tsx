"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar, Image as ImageIcon } from "lucide-react"
import { deleteGalleryItem } from "@/app/actions/gallery" // Ajuste o nome da sua action

interface GalleryItemProps {
  item: {
    id: string
    title: string
    imageUrl: string
    createdAt: Date
    // Adicione outros campos se tiver (ex: category)
  }
}

export function GalleryCard({ item }: GalleryItemProps) {
  
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
      
      {/* 1. ÁREA DA IMAGEM (Aspecto Quadrado ou 4:3) */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <Image 
            src={item.imageUrl} 
            alt={item.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={32} /></div>
        )}

        {/* Overlay Escuro ao passar o mouse (para destacar ações) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

        {/* Data (Badge flutuante) */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Calendar size={10} />
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* 2. CONTEÚDO E AÇÕES */}
      <div className="p-3 flex items-center justify-between gap-3">
         
         {/* Título truncado */}
         <div className="flex-1 min-w-0">
             <h3 className="font-bold text-slate-700 text-sm truncate" title={item.title}>
                {item.title}
             </h3>
             <p className="text-[10px] text-slate-400">ID: {item.id.slice(0,8)}...</p>
         </div>

         {/* Botões Compactos */}
         <div className="flex items-center gap-1">
             <Link href={`/admin/gallery/${item.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700">
                    <Pencil size={16} />
                </Button>
             </Link>

             {/* Form com input hidden (Padrão Seguro) */}
             <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={item.id} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                </Button>
             </form>
         </div>
      </div>
    </div>
  )
}