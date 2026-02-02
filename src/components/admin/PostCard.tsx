"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Calendar, Star, Image as ImageIcon } from "lucide-react"
import { deletePost } from "@/app/actions/posts" 

interface PostProps {
  post: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    published: boolean
    featured: boolean
    type: string
    createdAt: Date
  }
}

export function PostCard({ post }: PostProps) {
  
  const getTypeColor = (type: string) => {
    switch(type) {
        case 'NEWS': return 'bg-blue-100 text-blue-700';
        case 'EVENT': return 'bg-purple-100 text-purple-700';
        case 'PROJECT': return 'bg-orange-100 text-orange-700';
        default: return 'bg-slate-100 text-slate-600';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-all group">
      
      {/* IMAGEM */}
      <div className="relative aspect-video bg-slate-100">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={32} /></div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${post.published ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                {post.published ? 'Publicado' : 'Rascunho'}
            </span>
            {post.featured && (
                <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm flex items-center gap-1 w-fit">
                    <Star size={10} fill="currentColor" /> Destaque
                </span>
            )}
        </div>
        
        <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm ${getTypeColor(post.type)}`}>
            {post.type}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="p-4 flex-1 flex flex-col">
         <h3 className="font-bold text-slate-800 text-base leading-tight mb-2 line-clamp-2 min-h-[2.5em]">
            {post.title}
         </h3>
         <div className="mt-auto pt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50">
            <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.createdAt).toLocaleDateString("pt-BR")}
            </div>
         </div>
      </div>

      {/* AÇÕES */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2">
          <Link href={`/admin/posts/${post.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-9 text-blue-600 border-blue-200 hover:bg-blue-50">
                <Pencil size={16} />
                <span className="hidden md:inline ml-2">Editar</span>
            </Button>
          </Link>
          <form action={async () => { await deletePost({ get: () => post.id } as any) }}>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 md:w-auto md:px-3 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300">
                <Trash2 size={16} />
            </Button>
          </form>
      </div>
    </div>
  )
}