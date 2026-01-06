import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `Notícias - ${settings.siteName}`,
    description: `Últimas notícias e eventos - ${settings.siteDescription}`,
  }
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const type = searchParams.type as "NEWS" | "EVENT" | "ACTIVITY" | "PROJECT" | undefined
  const perPage = 9

  const where = {
    published: true,
    ...(type && { type })
  }

  const [posts, total, settings] = await Promise.all([
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
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Notícias e Eventos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Fique por dentro das últimas novidades da {settings.siteName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["all", "NEWS", "EVENT", "ACTIVITY", "PROJECT"].map((t) => (
              <Link
                key={t}
                href={`/noticias${t !== "all" ? `?type=${t}` : ""}`}
                className={`px-4 py-2 rounded-full transition-all ${
                  (t === "all" && !type) || type === t
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {t === "all" ? "Todos" : t === "NEWS" ? "Notícias" : t === "EVENT" ? "Eventos" : t === "ACTIVITY" ? "Atividades" : "Projetos"}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Nenhuma notícia encontrada.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post) => (
                  <Link key={post.id} href={`/noticias/${post.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
                      {post.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-2">
                          <span className="px-2 py-1 bg-blue-100 rounded-full">
                            {post.type === "NEWS" ? "Notícia" : post.type === "EVENT" ? "Evento" : post.type === "ACTIVITY" ? "Atividade" : "Projeto"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 line-clamp-3 mb-4">{post.summary}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                          </div>
                          {post.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              {post.location}
                            </div>
                          )}
                        </div>
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
                      href={`/noticias?page=${p}${type ? `&type=${type}` : ""}`}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        p === page
                          ? "bg-blue-600 text-white shadow-lg"
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
