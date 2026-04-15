import { prisma } from "@/lib/prisma"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"
import { Award, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Patrocinadores - Polícia Militar Mirim",
  description: "Empresas que acreditam e investem no futuro dos nossos jovens.",
}

export default async function PatrocinadoresPage() {
  const sponsors = await prisma.banner.findMany({
    where: { type: "SPONSOR", active: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <PageHero
        title="Nossos Patrocinadores"
        subtitle="Empresas e pessoas que acreditam e investem no futuro dos nossos jovens."
        icon={Award}
        themeColor="green"
        bgColor="bg-yellow-950"
        bgImage="/bg/bg-parceiros.png"
      />

      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">

        {sponsors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center p-8 gap-5 group"
              >
                <div className="relative w-full h-28 flex items-center justify-center">
                  <Image
                    src={sponsor.imageUrl}
                    alt={sponsor.title || "Patrocinador"}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {sponsor.title && (
                  <h3 className="font-bold text-slate-800 text-center text-base leading-tight">
                    {sponsor.title}
                  </h3>
                )}

                {sponsor.description && (
                  <p className="text-slate-500 text-sm text-center leading-relaxed line-clamp-3">
                    {sponsor.description}
                  </p>
                )}

                {sponsor.link && (
                  <Link
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center gap-2 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-full transition-colors"
                  >
                    Visitar site <ExternalLink size={13} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-xl border border-slate-100 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nenhum Patrocinador Cadastrado</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Em breve divulgaremos as empresas que apoiam nossa missão.
            </p>
          </div>
        )}
      </main>

      <BackButton className="mt-8" />
    </div>
  )
}
