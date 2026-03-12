// src/app/projetos/[slug]/page.tsx
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/settings"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Lightbulb, Target, Users, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { PageHero } from "@/components/ui/page-hero"
import { BackButton } from "@/components/ui/back-button"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const project = await prisma.post.findUnique({
    where: { slug: params.slug, published: true, type: "PROJECT" },
  })

  if (!project) {
    return { title: "Projeto não encontrado" }
  }

  return {
    title: `${project.title} - PMMIRIM`,
    description: project.summary,
  }
}

export default async function ProjetoPage(props: Props) {
  const params = await props.params;
  
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

  // Imagem de fundo: usa a capa do projeto ou o padrão
  const bgImage = project.coverImage || "/bg/bg-projetos.png";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. HERO PADRONIZADO (Tema Verde) */}
      <PageHero 
        title={project.title}
        subtitle={project.summary || "Iniciativa de transformação social e educacional."}
        icon={Lightbulb}
        themeColor="green"
        bgColor="bg-green-950"
        bgImage={bgImage}
        
        // Navegação
        backLink="/projetos"
        backText="Voltar para Projetos"
      />

      <main className="flex-1 container mx-auto px-4 -mt-10 relative z-20 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLUNA ESQUERDA: Conteúdo Principal */}
            <article className="lg:col-span-2 space-y-8">
                
                {/* Cards de Destaque (Objetivo, Público, Impacto) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-2 text-emerald-700 font-bold">
                            <Target size={20} /> <h3>Objetivo</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Promover cidadania e valores através da educação.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-2 text-blue-700 font-bold">
                            <Users size={20} /> <h3>Público</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Jovens de 10 a 17 anos da comunidade.</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-100 hover:-translate-y-1 transition-transform">
                        <div className="flex items-center gap-3 mb-2 text-yellow-600 font-bold">
                            <Award size={20} /> <h3>Impacto</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Transformação social e desenvolvimento pessoal.</p>
                    </div>
                </div>

                {/* Texto do Projeto */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
                    <div
                        className="prose prose-lg prose-slate max-w-none
                        prose-headings:text-slate-900 prose-headings:font-bold
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-justify
                        prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-strong:text-slate-900 prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                        dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                </div>
            </article>

            {/* COLUNA DIREITA: Projetos Relacionados */}
            <aside className="space-y-8">
                {relatedProjects.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                        <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                           <Award size={20} className="text-emerald-500"/> Outros Projetos
                        </h3>
                        
                        <div className="space-y-6">
                            {relatedProjects.map((related) => (
                                <Link key={related.id} href={`/projetos/${related.slug}`} className="group block">
                                    <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3 bg-slate-100">
                                        {related.coverImage ? (
                                            <Image 
                                                src={related.coverImage} 
                                                alt={related.title} 
                                                fill 
                                                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300"><Lightbulb size={32}/></div>
                                        )}
                                        {/* Tag */}
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-black px-2 py-1 rounded shadow-sm">
                                            PROJETO
                                        </div>
                                    </div>
                                    
                                    <h4 className="text-sm font-bold text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                        {related.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                                        {related.summary}
                                    </p>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Ler mais <ArrowRight size={10} />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </div>
        
        <BackButton className="mt-16" />
      </main>
    </div>
  )
}