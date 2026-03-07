import { prisma } from "@/lib/prisma"
import { UserCog } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"
import { DiretoriaGrid } from "./diretoria-grid" // 👈 Importamos o componente novo

export const dynamic = "force-dynamic"

export default async function DiretoriaPage() {
  // Puxa os dados do banco
  const allMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  })
  
  // Filtra apenas a Diretoria
  const boardMembers = allMembers.filter(m => m.category.includes("Diretoria"));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Diretoria Executiva"
        subtitle="Liderança estratégica e administrativa responsável pela gestão da instituição."
        icon={UserCog}
        themeColor="blue"
        bgColor="bg-blue-950"
        bgImage="/bg/bg-diretoria.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        
        {/* Passa os dados para o Client Component fazer o Modal */}
        <DiretoriaGrid boardMembers={boardMembers} />
        
        <BackButton className="mt-16" />
      </section>
    </main>
  )
}