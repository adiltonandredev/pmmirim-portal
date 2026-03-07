import { prisma } from "@/lib/prisma"
import { Users } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"
import { TeamGrid } from "./team-grid"

export const dynamic = "force-dynamic"

export default async function EquipePage() {
  // O Servidor puxa os dados e entrega prontos para o Client Component
  const allMembers = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  const teamMembers = allMembers.filter(m => !m.category.includes("Diretoria"));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Nossa Equipe"
        subtitle="Quem faz acontecer."
        icon={Users}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-equipe.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-slate-100">
            {/* Componente Client que lida com o Grid e o Modal */}
            <TeamGrid teamMembers={teamMembers} />
        </div>
        
        <BackButton className="mt-8" />
      </section>
    </main>
  )
}