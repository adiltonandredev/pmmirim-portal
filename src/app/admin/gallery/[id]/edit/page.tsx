import { prisma } from "@/lib/prisma"
import { deleteSingleImage } from "@/app/actions/gallery"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Image as ImageIcon, LayoutGrid } from "lucide-react"
import { notFound } from "next/navigation"
import { GalleryUploader } from "@/components/admin/GalleryUploader"
import { DeleteButton } from "@/components/admin/DeleteButton" // <--- Importamos aqui também

export default async function ManageGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { id: 'desc' } } }
  })

  if (!gallery) return notFound()

  return (
    <PageContainer>
      
      <PageHeader>
        <PageTitle 
            title={gallery.title} 
            subtitle={`Gerenciando ${gallery.images.length} fotos em /${gallery.slug}`} 
            icon={LayoutGrid} 
            backLink="/admin/gallery"
        />
      </PageHeader>

      <PageContent>
        <div className="pb-32">
            
            <div className="mb-10">
                <GalleryUploader galleryId={gallery.id} />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <ImageIcon className="text-blue-600" size={20} />
                        Galeria de Imagens
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Total: {gallery.images.length}
                    </span>
                </div>

                {gallery.images.length === 0 && !gallery.coverUrl && (
                    <div className="text-center py-12 text-slate-400 italic">
                        Nenhuma foto adicionada ainda. Use a área acima para enviar.
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    
                    {gallery.coverUrl && (
                        <div className="group relative aspect-square rounded-2xl overflow-hidden border-4 border-blue-100 shadow-md bg-white">
                            <img src={gallery.coverUrl} alt="Capa" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide z-10">
                                Capa
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end justify-center pb-2 opacity-80">
                                <span className="text-white text-[10px] font-medium">Principal</span>
                            </div>
                        </div>
                    )}

                    {gallery.images.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <img 
                                src={img.url} 
                                alt="Foto" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                            
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* --- BOTÃO DE DELETAR SEGURO (FOTO) --- */}
                            <div className="absolute top-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
                                <DeleteButton 
                                    action={deleteSingleImage.bind(null, img.id, gallery.id)} 
                                    itemId={img.id}
                                    itemName="esta foto"
                                />
                            </div>
                            {/* -------------------------------------- */}
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </PageContent>
    </PageContainer>
  )
}