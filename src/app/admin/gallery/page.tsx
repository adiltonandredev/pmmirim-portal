import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image" // <--- Importamos o componente otimizado
import { Button } from "@/components/ui/button"
import { Plus, Folder, Image as ImageIcon, Calendar, Pencil } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { deleteGallery } from "@/app/actions/gallery"
import { DeleteButton } from "@/components/admin/DeleteButton"

export const dynamic = "force-dynamic"

export default async function AdminGalleryPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
        _count: { select: { images: true } }, 
        images: { take: 1 } 
    } 
  })

  return (
    <PageContainer>
      
      <PageHeader>
        <PageTitle 
            title="Galeria de Álbuns" 
            subtitle="Gerencie as pastas de fotos dos eventos."
            icon={ImageIcon} 
        />
        <Link href="/admin/gallery/new" className="w-full md:w-auto mt-3 md:mt-0">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm">
            <Plus size={18} /> Novo Álbum
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {galleries.map((album) => {
                // Lógica de Seleção e Validação da Imagem
                const rawImage = album.coverUrl || album.images[0]?.url || null;
                
                // CORREÇÃO: Aceita imagens locais (/)
                const hasValidImage = rawImage && (
                    rawImage.startsWith('data:') || 
                    rawImage.startsWith('http') || 
                    rawImage.startsWith('/')
                );

                return (
                    <div key={album.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                        
                        <Link href={`/admin/gallery/${album.id}/edit`} className="relative aspect-video bg-slate-100 block overflow-hidden">
                            {hasValidImage ? (
                                <Image 
                                    src={rawImage!} 
                                    alt={album.title} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 bg-slate-50">
                                    <Folder size={40} className="mb-2 opacity-50" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Sem Capa</span>
                                </div>
                            )}
                            
                            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                <ImageIcon size={10} />
                                {album._count.images} FOTOS
                            </div>
                        </Link>

                        <div className="p-4 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="font-bold text-slate-800 text-base leading-tight truncate" title={album.title}>
                                    {album.title}
                                </h3>
                                <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                                    <Calendar size={12} />
                                    {new Date(album.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                <Link href={`/admin/gallery/${album.id}/edit`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full h-8 text-xs font-bold text-slate-600 hover:text-blue-600">
                                        <Pencil size={14} className="mr-1.5" /> Gerenciar
                                    </Button>
                                </Link>

                                <DeleteButton 
                                    action={deleteGallery} 
                                    itemId={album.id}
                                    itemName={`o álbum "${album.title}"`}
                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center rounded-md transition-colors cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>

        {galleries.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 mt-8">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <Folder size={32} className="text-blue-200" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">Nenhum álbum criado</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1 mb-6">
                    Crie o primeiro álbum para começar a organizar as fotos dos eventos.
                </p>
                <Link href="/admin/gallery/new">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                        Criar Primeiro Álbum
                    </Button>
                </Link>
            </div>
        )}
      </PageContent>
    </PageContainer>
  )
}