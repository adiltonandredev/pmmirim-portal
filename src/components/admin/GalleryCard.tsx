"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, Calendar, Image as ImageIcon } from "lucide-react"
import { deleteGallery } from "@/actions/gallery"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface GalleryItemProps {
  item: {
    id: string
    title: string
    imageUrl: string
    createdAt: Date
  }
}

export function GalleryCard({ item }: GalleryItemProps) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      const result = await deleteGallery(item.id) as any
      if (result?.success) {
        toast.success("Item removido com sucesso")
        router.refresh()
      } else {
        toast.error(result?.message || "Erro ao remover")
      }
    } catch (error) {
      toast.error("Erro na comunicação com o servidor")
    }
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
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

        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Calendar size={10} />
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div className="p-3 flex items-center justify-between gap-3">
         <div className="flex-1 min-w-0">
             <h3 className="font-bold text-slate-700 text-sm truncate" title={item.title}>
                {item.title}
             </h3>
             <p className="text-[10px] text-slate-400 font-mono">ID: {item.id.slice(0,8)}</p>
         </div>

         <div className="flex items-center gap-1">
             <Link href={`/admin/gallery/${item.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
                    <Pencil size={16} />
                </Button>
             </Link>

             {/* Substituído pelo DeleteButton padrão do projeto PMM */}
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
             </Button>
         </div>
      </div>
    </div>
  )
}
// Nota: Importe o seu componente DeleteButton real aqui se ele já estiver criado.
import { Trash2 } from "lucide-react"