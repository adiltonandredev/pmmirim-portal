import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, Tag, GripVertical } from "lucide-react"
import { deleteBanner, toggleBannerActive } from "@/app/actions/banners"

// Tipagem do Banner (ajuste conforme seu Prisma se precisar)
interface BannerProps {
  banner: {
    id: string
    title?: string | null
    description?: string | null
    imageUrl: string
    active: boolean
    type: string
    order: number
    link?: string | null
  }
}

export function BannerCard({ banner }: BannerProps) {
  
  // Helper de cores por tipo
  const getTypeLabel = (type: string) => {
    switch(type) {
        case 'HOME': return { text: 'Home', class: 'bg-blue-100 text-blue-700 border-blue-200' };
        case 'PARTNER': return { text: 'Parceiro', class: 'bg-purple-100 text-purple-700 border-purple-200' };
        case 'SPONSOR': return { text: 'Patrocínio', class: 'bg-orange-100 text-orange-700 border-orange-200' };
        default: return { text: type, class: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  }

  const typeInfo = getTypeLabel(banner.type);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md hover:border-blue-300 transition-all group">
      
      {/* 1. ÁREA DA IMAGEM */}
      <div className="relative aspect-video bg-slate-100">
        {banner.imageUrl ? (
          <Image src={banner.imageUrl} alt={banner.title || "Banner"} fill className="object-cover transition-transform group-hover:scale-105 duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={32} /></div>
        )}
        
        {/* Badge Status */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm uppercase ${banner.active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
          {banner.active ? 'Ativo' : 'Inativo'}
        </div>

        {/* Badge Tipo */}
        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm flex items-center gap-1 border ${typeInfo.class}`}>
          <Tag size={10} /> {typeInfo.text}
        </div>
      </div>

      {/* 2. CONTEÚDO (Centralizado no Mobile) */}
      <div className="p-4 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
         
         <div className="w-full flex justify-center md:justify-between items-start mb-1">
            <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1">
                {banner.title || "Sem Título"}
            </h3>
            
            {/* Ordem: Oculta no mobile para limpar a tela */}
            <span className="hidden md:flex items-center gap-1 text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100">
                <GripVertical size={10} /> {banner.order}º
            </span>
         </div>

         <p className="text-slate-500 text-sm mb-3 line-clamp-2 min-h-[2.5em]">
            {banner.description || "Sem descrição definida."}
         </p>

         {/* Link: Só aparece se existir, com truncate */}
         {banner.link && (
            <div className="text-xs text-blue-600 bg-blue-50 py-1 px-2 rounded max-w-full truncate mb-2">
                Link: {banner.link}
            </div>
         )}
      </div>

      {/* 3. RODAPÉ DE AÇÕES (Ícones no Mobile / Texto no Desktop) */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Botão VISIBILIDADE */}
          <form action={toggleBannerActive.bind(null, banner.id, banner.active)} className="flex-1">
            <Button 
                variant="outline" 
                size="sm" 
                className={`w-full h-9 ${banner.active ? "text-emerald-600 border-emerald-200 hover:bg-emerald-50" : "text-slate-400 border-dashed"}`}
                title={banner.active ? "Ocultar" : "Mostrar"}
            >
                {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                {/* Texto some no mobile (hidden), aparece no médio (md:inline) */}
                <span className="hidden md:inline ml-2">{banner.active ? "Visível" : "Oculto"}</span>
            </Button>
          </form>
          
          {/* Botão EDITAR */}
          <Link href={`/admin/banners/${banner.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full h-9 text-blue-600 border-blue-200 hover:bg-blue-50">
                <Pencil size={16} />
                <span className="hidden md:inline ml-2">Editar</span>
            </Button>
          </Link>
          
          {/* Botão EXCLUIR (Sempre só ícone ou compacto) */}
          <form action={deleteBanner.bind(null, banner.id)}>
            <Button variant="outline" size="sm" className="h-9 w-9 p-0 md:w-auto md:px-3 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300">
                <Trash2 size={16} />
                {/* Opcional: Se quiser texto excluir no desktop, descomente abaixo */}
                {/* <span className="hidden md:inline ml-2">Excluir</span> */}
            </Button>
          </form>
      </div>
    </div>
  )
}