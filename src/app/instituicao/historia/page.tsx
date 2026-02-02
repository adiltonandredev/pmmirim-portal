// src/app/instituicao/historia/page.tsx
import { prisma } from "@/lib/prisma"
import { Target, Eye, Heart, BookOpen, ScrollText } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import { InfoCard } from "@/components/ui/info-card"

export const dynamic = "force-dynamic"

export default async function HistoriaPage() {
  const history = await prisma.institutionHistory.findFirst()

  if (!history) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-40">
        <div className="bg-slate-100 p-6 rounded-full mb-4">
            <BookOpen size={48} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">História não cadastrada</h1>
        <p className="text-slate-500 mt-2">Acesse o painel administrativo para adicionar o conteúdo.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title={history.title}
        subtitle="Conheça a trajetória de dedicação e disciplina que molda o futuro dos nossos jovens."
        icon={ScrollText} 
        bgColor="bg-blue-950"
        themeColor="blue"
        bgImage="/bg/bg-historia.png"
      />

      <div className="container mx-auto px-4 relative -mt-6 z-20 pb-20">
         
         <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 mb-16 border border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50"></div>

            <div 
              className="prose prose-lg max-w-none text-slate-600 text-justify prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose prose-a:text-blue-600 prose-img:rounded-2xl prose-img:shadow-lg prose-strong:text-blue-900"
              dangerouslySetInnerHTML={{ __html: history.content }} 
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {history.mission && (
              <InfoCard icon={Target} title="Missão" text={history.mission} variant="blue" />
            )}
            {history.vision && (
              <InfoCard icon={Eye} title="Visão" text={history.vision} variant="green" />
            )}
            {history.values && (
              <InfoCard icon={Heart} title="Valores" text={history.values} variant="red" />
            )}
            {history.principles && (
              <InfoCard icon={BookOpen} title="Princípios" text={history.principles} variant="yellow" />
            )}
         </div>
              
              <BackButton className="mt-16" />

      </div>
    </main>
  )
}