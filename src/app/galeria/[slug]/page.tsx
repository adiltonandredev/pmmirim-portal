/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAlbum } from "@/app/actions/gallery"
import { PhotoGrid } from "@/components/gallery/PhotoGrid"
import { Camera, Images } from "lucide-react"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export default async function AlbumPage(props: Props) {
  const params = await props.params
  const album = await getAlbum(params.slug)

  if (!album) {
    notFound()
  }

  // --- A SOLUÇÃO (VACINA) ---
  const alb = album as any; 
  // Agora usamos 'alb' para calcular a imagem de fundo
  const bgImage = alb.coverImage || alb.imageUrl || alb.cover || alb.photos?.[0]?.url || "/bg/bg-galeria.png";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* 1. HERO PADRONIZADO */}
      <PageHero 
        // CORREÇÃO AQUI: Usar 'alb' em vez de 'album' remove o sublinhado
        title={alb.title} 
        subtitle={alb.description || "Confira as fotos deste evento."}
        icon={Camera}
        
        themeColor="green"
        bgColor="bg-green-950"
        bgImage={bgImage}
        
        backLink="/galeria"
        backText="Voltar para Galeria"
      />

      <main className="flex-grow">
        
        {/* 2. GRID DE FOTOS */}
        <section className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 min-h-[300px]">
              
              {/* CORREÇÃO AQUI TAMBÉM: Usar 'alb.photos' */}
              {alb.photos && alb.photos.length > 0 ? (
                 <PhotoGrid photos={alb.photos} />
              ) : (
                 // Estado Vazio
                 <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 h-full">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Images size={40} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-600">Álbum Vazio</h3>
                    <p className="text-sm text-slate-400">Nenhuma foto adicionada neste álbum ainda.</p>
                 </div>
              )}
            </div>
        </section>
        
        <div className="container mx-auto px-4 pb-10">
            <BackButton className="mt-0" />
        </div>
      </main>
    </div>
  )
}