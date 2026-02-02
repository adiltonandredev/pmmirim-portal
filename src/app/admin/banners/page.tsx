import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Plus, Image as ImageIcon, Pencil, ExternalLink, Eye, EyeOff } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteBanner } from "@/app/actions/banners"

export const dynamic = "force-dynamic"

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: [
        { type: 'asc' }, 
        { order: 'asc' } 
    ],
  })

  // Helper para cor do badge
  const getTypeBadge = (type: string) => {
    switch(type) {
        case 'HOME': return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase">Principal</span>
        case 'PARTNER': return <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200 uppercase">Parceiro</span>
        case 'SPONSOR': return <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-200 uppercase">Patrocinador</span>
        default: return <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">{type}</span>
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Gestão de Banners" 
            subtitle="Gerencie os destaques da página inicial e parceiros."
            icon={ImageIcon} 
        />
        <Link href="/admin/banners/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Banner
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-300 transition-all">
                    
                    {/* ÁREA DA IMAGEM */}
                    <div className="relative aspect-video bg-slate-100 border-b border-slate-100">
                        {banner.imageUrl ? (
                            <Image 
                                src={banner.imageUrl} 
                                alt={banner.title || "Banner"} 
                                fill 
                                className={`object-cover transition-all duration-500 ${!banner.active ? "grayscale opacity-50" : "group-hover:scale-105"}`}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ImageIcon size={32} />
                            </div>
                        )}
                        
                        {/* Status Flutuante */}
                        <div className="absolute top-2 right-2">
                             {banner.active ? (
                                <div className="bg-green-500 text-white p-1 rounded-full shadow-sm" title="Ativo"><Eye size={12} /></div>
                             ) : (
                                <div className="bg-red-500 text-white p-1 rounded-full shadow-sm" title="Inativo"><EyeOff size={12} /></div>
                             )}
                        </div>
                        
                        {/* Badge de Tipo */}
                        <div className="absolute bottom-2 left-2">
                            {getTypeBadge(banner.type)}
                        </div>
                    </div>

                    {/* CONTEÚDO */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{banner.title || "Sem Título"}</h3>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 rounded border border-slate-100">#{banner.order}</span>
                        </div>
                        
                        <p className="text-xs text-slate-500 line-clamp-2 min-h-[2.5em]">
                            {banner.description || "Sem descrição."}
                        </p>

                        {banner.link && (
                            <div className="flex items-center gap-1 text-[10px] text-blue-600 truncate">
                                <ExternalLink size={10} /> {banner.link}
                            </div>
                        )}

                        {/* AÇÕES */}
                        <div className="mt-auto pt-3 flex items-center justify-end gap-2 border-t border-slate-50">
                            <Link href={`/admin/banners/${banner.id}/edit`}>
                                <Button variant="outline" size="sm" className="h-8 px-3 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 text-xs font-bold">
                                    <Pencil size={14} className="mr-1.5" /> Editar
                                </Button>
                            </Link>

                            <DeleteButton 
                                action={deleteBanner} 
                                itemId={banner.id} 
                                itemName="este banner"
                                className="h-8 w-8 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {banners.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                   <ImageIcon size={32} className="opacity-30" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Nenhum banner encontrado</h3>
                <p className="text-xs mb-4">Adicione o primeiro banner para começar.</p>
                <Link href="/admin/banners/new">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold">
                        Criar Banner
                    </Button>
                </Link>
            </div>
        )}
      </PageContent>
    </PageContainer>
  )
}