import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    return {
      title: "Notícia não encontrada",
    }
  }

  return {
    title: `${post.title} - PMMIRIM`,
    description: post.summary,
  }
}

export default async function NoticiaPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    notFound()
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      type: post.type,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Voltar para notícias
          </Link>

          {post.coverImage && (
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              {post.type === "NEWS" ? "Notícia" : post.type === "EVENT" ? "Evento" : post.type === "ACTIVITY" ? "Atividade" : "Projeto"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-slate-600 mb-6">{post.summary}</p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              {post.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {post.location}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-8" />

          <div
            className="prose prose-lg prose-slate max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-p:text-slate-700 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-lg
              prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {relatedPosts.length > 0 && (
          <section className="bg-slate-100 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Veja também
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/noticias/${related.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    {related.coverImage && (
                      <div className="relative h-40">
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
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
      <Footer />
    </>
  )
}
