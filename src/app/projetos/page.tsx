import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Award, Users, Target } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

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
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const perPage = 9

  const where = {
    published: true,
    type: "PROJECT" as const
  }

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
    <>
      <Navbar settings={settings} />
      <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-slate-50">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Award size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Projetos PMMIRIM
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Conheça os projetos que transformam vidas e constroem cidadania através da educação e valores
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-600">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="text-green-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">500+</h3>
              </div>
              <p className="text-slate-600">Jovens impactados pelos projetos</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="text-blue-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{total}</h3>
              </div>
              <p className="text-slate-600">Projetos em andamento ou concluídos</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-600">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award className="text-yellow-600" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">15</h3>
              </div>
              <p className="text-slate-600">Anos dedicados à comunidade</p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <Award className="mx-auto mb-4 text-slate-400" size={64} />
              <p className="text-slate-500 text-lg">Nenhum projeto publicado ainda.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {projects.map((project, index) => (
                  <Link key={project.id} href={`/projetos/${project.slug}`} style={{animationDelay: `${index * 100}ms`}}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border-2 border-transparent hover:border-green-600">
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-green-200 to-green-300">
                        {project.coverImage ? (
                          <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-green-500">
                            <Award size={64} />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Projeto
                        </div>
                      </div>
                      <CardHeader>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                          {project.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 line-clamp-4 mb-4 leading-relaxed">
                          {project.summary}
                        </p>
                        <span className="text-green-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                          Saiba mais →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/projetos?page=${p}`}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        p === page
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer settings={settings} />
    </>
  )
}
