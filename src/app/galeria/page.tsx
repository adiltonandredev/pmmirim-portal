// src/app/galeria/page.tsx
import { getAlbums } from "@/app/actions/gallery"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ImageIcon, ArrowRight, Camera, Images } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"

export const dynamic = "force-dynamic"

export default async function GaleriaPage() {
  const albums = await getAlbums()

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* 1. HERO PADRONIZADO (Tema Verde) */}
      <PageHero 
        title="Galeria de Fotos"
        subtitle="Confira os registros dos melhores momentos, eventos e treinamentos da Polícia Mirim."
        icon={Camera}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-galeria.png"
      />

      {/* 2. CONTEÚDO */}
      <div className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
         
         {albums.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {albums.map((album: any) => { // <--- CORREÇÃO: Adicionei ': any' para aceitar os campos sem travar
                 
                 // CORREÇÃO: Tenta pegar a imagem de todas as formas possíveis que seu banco pode ter
                 const coverImage = (album as any).coverImage || (album as any).imageUrl || (album as any).cover || album.photos?.[0]?.url || "";
                 
                 // Pega a quantidade de fotos (se existir)
                 const photoCount = album.photos?.length || 0;

                 return (
                   <Link 
                     key={album.id} 
                     href={`/galeria/${album.id}`}
                     className="group flex flex-col h-full"
                   >
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                          
                          {/* Imagem de Capa */}
                          <div className="relative h-64 w-full bg-slate-200 overflow-hidden">
                            {coverImage ? (
                              <Image
                                src={coverImage}
                                alt={album.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-slate-400 bg-slate-100">
                                 <ImageIcon size={48} opacity={0.3} />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                            {/* Badge de Contador de Fotos */}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                                <Images size={12} />
                                {photoCount} FOTOS
                            </div>
                          </div>

                          {/* Corpo do Card */}
                          <div className="p-6 md:p-8 flex flex-col flex-grow">
                             
                             <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-wider mb-3">
                                <Calendar size={14} />
                                {/* Data segura */}
                                {new Date(album.date || album.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                             </div>

                             <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                                {album.title}
                             </h3>
                             
                             {album.description && (
                               <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed text-justify flex-1">
                                  {album.description}
                               </p>
                             )}

                             <div className="mt-auto pt-6 border-t border-slate-100">
                                <span className="inline-flex items-center text-xs font-bold text-slate-900 uppercase tracking-wide group-hover:text-emerald-600 transition-colors">
                                   Ver Álbum Completo <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                             </div>
                          </div>
                      </div>
                   </Link>
                 )
               })}
             </div>
           ) : (
             <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                   <ImageIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Galeria Vazia</h3>
                <p className="text-slate-500">Novos eventos e registros serão publicados em breve.</p>
             </div>
           )}
      </div>
    </main>
  )
}