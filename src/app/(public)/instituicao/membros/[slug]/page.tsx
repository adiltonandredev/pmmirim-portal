import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Users } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"
import { MembersGrid } from "@/components/public/members/MembersGrid"

export const dynamic = "force-dynamic"

export default async function MembersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await prisma.memberCategory.findUnique({ where: { slug } })
  if (!category) return notFound()

  const members = await prisma.teamMember.findMany({
    where: { category: category.name, active: true },
    orderBy: { order: "asc" },
  })

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero
        title={category.name}
        subtitle="Conheça os integrantes desta área."
        icon={Users}
        themeColor="blue"
        bgColor="bg-blue-950"
        bgImage="/bg/bg-equipe.png"
      />

      <section className="container mx-auto px-4 relative z-20 -mt-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-10 border border-slate-100">
          {members.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">Nenhum membro cadastrado nesta categoria ainda.</p>
            </div>
          ) : (
            <MembersGrid members={members} />
          )}
        </div>
        <BackButton className="mt-8" />
      </section>
    </main>
  )
}
