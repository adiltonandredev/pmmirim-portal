import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"
import { Award, Users, Target, Lightbulb } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { ProjetosGrid } from "./projetos-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `Projetos - ${settings.siteName}`,
    description: `Conheça os projetos desenvolvidos pela ${settings.siteName}`,
  }
}

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1")
  const perPage = 9

  const where = {
    published: true,
    type: "PROJECT" as const
  }

  // Buscamos Projetos, Total e Configurações
  const [projects, total, settings] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
    getSiteSettings(),
  ])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <PageHero
        title="Nossos Projetos"
        subtitle="Conheça as iniciativas que transformam vidas e constroem cidadania através da educação e valores."
        icon={Lightbulb}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage="/bg/bg-projetos.png"
      />

      {/* 2. CONTEÚDO (Sobreposição -mt-6) */}
      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">

        {/* SEÇÃO DE ESTATÍSTICAS (DINÂMICA) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* JOVENS IMPACTADOS (Vem do Admin) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
              <Users size={32} strokeWidth={2.5} />
            </div>
            <div>
              {/* Usa o valor do banco ou o padrão "500+" */}
              <h3 className="text-3xl font-black text-slate-900 leading-none">
                {settings?.impactedYouth || "500+"}
              </h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Jovens Impactados</p>
            </div>
          </div>

          {/* PROJETOS ATIVOS (Automático) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <Target size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{total}</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Projetos Ativos</p>
            </div>
          </div>

          {/* ANOS DE HISTÓRIA (Vem do Admin) */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-yellow-100 text-yellow-600 rounded-xl">
              <Award size={32} strokeWidth={2.5} />
            </div>
            <div>
               {/* Usa o valor do banco ou o padrão "15" */}
              <h3 className="text-3xl font-black text-slate-900 leading-none">
                {settings?.yearsOfHistory || "15"}
              </h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Anos de História</p>
            </div>
          </div>
        </div>

        {/* LISTAGEM DE PROJETOS */}
        {projects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Award size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Nenhum projeto encontrado</h3>
            <p className="text-slate-500 mt-2">Novos projetos serão adicionados em breve.</p>
          </div>
        ) : (
          <>
            <ProjetosGrid projects={projects} />

            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pb-12">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/projetos?page=${p}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${p === page
                        ? "bg-emerald-600 text-white shadow-emerald-200 ring-2 ring-emerald-600 ring-offset-2"
                        : "bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600 border border-slate-200"
                      }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
        
        <BackButton className="mt-16" />
      </main>
    </div>
  )
}