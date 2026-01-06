import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Award, ArrowLeft, Target, Users } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await prisma.post.findUnique({
    where: { slug: params.slug, published: true, type: "PROJECT" },
  })

  if (!project) {
    return {
      title: "Projeto não encontrado",
    }
  }

  return {
    title: `${project.title} - PMMIRIM`,
    description: project.summary,
  }
}

export default async function ProjetoPage({
  params,
}: {
  params: { slug: string }
}) {
  const [project, settings] = await Promise.all([
    prisma.post.findUnique({
      where: { slug: params.slug, published: true, type: "PROJECT" },
    }),
    getSiteSettings(),
  ])

  if (!project) {
    notFound()
  }

  const relatedProjects = await prisma.post.findMany({
    where: {
      published: true,
      type: "PROJECT",
      id: { not: project.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <Navbar settings={settings} />
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 group"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
              Voltar para projetos
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Award size={24} />
              </div>
              <span className="text-green-100 font-semibold">Projeto</span>
            </div>
          </div>
        </div>

        <article className="container mx-auto px-4 py-12 max-w-5xl">
          {project.coverImage && (
            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden mb-10 shadow-2xl -mt-20 border-4 border-white">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-green-600 pl-6 py-2 bg-green-50 rounded-r-lg">
              {project.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Target className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Objetivo</h3>
              </div>
              <p className="text-sm text-slate-600">
                Promover cidadania e valores através da educação
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Público</h3>
              </div>
              <p className="text-sm text-slate-600">
                Jovens de 10 a 17 anos da comunidade
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-yellow-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Award className="text-white" size={20} />
                </div>
                <h3 className="font-bold text-slate-900">Impacto</h3>
              </div>
              <p className="text-sm text-slate-600">
                Transformação social e desenvolvimento pessoal
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-10" />

          <div
            className="prose prose-lg prose-slate max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
              prose-h2:text-green-600 prose-h2:border-b-2 prose-h2:border-green-200 prose-h2:pb-2
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-ul:my-6 prose-li:text-slate-700
              prose-blockquote:border-l-green-600 prose-blockquote:bg-green-50 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </article>

        {relatedProjects.length > 0 && (
          <section className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 mt-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
                <Award className="text-green-600" size={32} />
                Outros Projetos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {relatedProjects.map((related) => (
                  <Link
                    key={related.id}
                    href={`/projetos/${related.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-green-600 group"
                  >
                    {related.coverImage && (
                      <div className="relative h-48 bg-gradient-to-br from-green-200 to-green-300">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="text-green-600" size={18} />
                        <span className="text-xs font-semibold text-green-600">PROJETO</span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {related.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer settings={settings} />
    </>
  )
}
