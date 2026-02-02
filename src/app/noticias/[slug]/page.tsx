import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Newspaper, ArrowRight, Tag } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    return { title: "Notícia não encontrada" }
  }

  return {
    title: `${post.title} - PMMirim`,
    description: post.summary,
  }
}

export default async function NoticiaPage(props: Props) {
  const params = await props.params;

  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) {
    notFound()
  }

  // Busca posts relacionados
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      type: post.type,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  const categoryLabel = {
    NEWS: "Notícia",
    EVENT: "Evento",
    ACTIVITY: "Atividade",
    PROJECT: "Projeto"
  }[post.type] || "Geral";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* 1. HERO PADRONIZADO */}
      <PageHero 
        title={post.title}
        subtitle={post.summary || ""}
        icon={Newspaper}
        bgColor="bg-red-950"
        themeColor="red"
        bgImage={post.coverImage || "/bg/bg-noticias.png"}
        backLink="/noticias"
        backText="Voltar para Notícias"
      />
      
      <main className="flex-1 container mx-auto px-4 -mt-6 relative z-20 pb-20">
        
        {/* LAYOUT ALTERADO: Coluna única centralizada (max-w-4xl) */}
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
            
            {/* ARTIGO PRINCIPAL */}
            <article className="w-full">
                {/* Container Branco (Card) */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 overflow-hidden">
                    
                    {/* Metadados */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-red-700 text-xs font-black uppercase tracking-wider border border-red-100">
                            <Tag size={12} strokeWidth={3} /> {categoryLabel}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <Calendar size={16} className="text-red-400" />
                            {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {/* Texto Rico */}
                    <div
                        className="prose prose-lg prose-slate max-w-none
                        prose-headings:text-slate-900 prose-headings:font-bold
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-justify
                        prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
                        prose-strong:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            {/* SEÇÃO VEJA TAMBÉM (Agora abaixo do artigo, em grid) */}
            {relatedPosts.length > 0 && (
                <aside className="w-full border-t border-slate-200 pt-12">
                    <h3 className="font-bold text-2xl text-slate-800 mb-8 flex items-center justify-center gap-2">
                       <Newspaper size={24} className="text-red-500"/> Veja também
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((related) => (
                            <Link key={related.id} href={`/noticias/${related.slug}`} className="group bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col gap-4">
                                {/* Miniatura */}
                                <div className="relative w-full h-40 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                    {related.coverImage ? (
                                        <Image src={related.coverImage} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300"><Newspaper size={32}/></div>
                                    )}
                                </div>
                                
                                {/* Texto */}
                                <div>
                                    <h4 className="font-bold text-slate-800 leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <span className="text-xs text-red-500 font-bold uppercase tracking-wide flex items-center gap-1">
                                        Ler agora <ArrowRight size={12}/>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </aside>
            )}

            {/* Botão Voltar */}
            <BackButton href="/noticias" label="Voltar para Notícias" className="mt-4" />

        </div>
      </main>
    </div>
  )
}