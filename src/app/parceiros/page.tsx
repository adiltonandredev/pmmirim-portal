/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"
import { Handshake } from "lucide-react"
import { PartnersGrid } from "@/components/home/PartnersGrid" 

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Nossos Parceiros - Polícia Militar Mirim",
  description: "Conheça as empresas e instituições que apoiam o projeto Polícia Mirim.",
}

export default async function ParceirosPage() {
  let partnersRaw: any[] = [];
  
  try {
     partnersRaw = await prisma.banner.findMany({
       orderBy: { createdAt: 'desc' }, 
     });
  } catch (e) {
     console.log("Erro ao buscar banners:", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      <PageHero 
        title="Nossos Parceiros"
        subtitle="Instituições e empresas que acreditam e investem no futuro dos nossos jovens."
        icon={Handshake}
        themeColor="blue"
        bgColor="bg-blue-950"
        bgImage="/bg/bg-parceiros.png" 
      />

      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        
        {partnersRaw.length > 0 ? (
          // Componente interativo
          <PartnersGrid partners={partnersRaw} />
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-slate-100 max-w-2xl mx-auto">
             <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake size={40} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Nenhum Parceiro Encontrado</h3>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">
               Não encontramos parceiros cadastrados no sistema.
             </p>
          </div>
        )}

      </main>
              
              <BackButton className="mt-16" />
    </div>
  )
}