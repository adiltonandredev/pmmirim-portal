import { prisma } from "@/lib/prisma"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import { GraduationCap } from "lucide-react"
import { CursosGrid } from "./cursos-grid" // 👈 Nosso novo componente

export const dynamic = "force-dynamic"

export default async function CursosPage() {
  // O servidor apenas busca os dados
  const coursesRaw = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero 
        title="Cursos & Formação"
        subtitle="Atividades educacionais, treinamentos e oficinas oferecidos pela Polícia Mirim."
        icon={GraduationCap}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-cursos.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        
        {/* Passa os dados para o grid renderizar a lista e o modal interativo */}
        <CursosGrid courses={coursesRaw} />
        
        <BackButton className="mt-16" />
      </section>
    </main>
  )
}