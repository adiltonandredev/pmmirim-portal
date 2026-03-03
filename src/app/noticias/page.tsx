import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { CalendarDays, ArrowRight, Search, Newspaper } from "lucide-react"
import { PostType } from "@prisma/client"
import { BackButton } from "@/components/ui/back-button" // <--- Importando botão padrão
import { NewsSearch } from "@/components/news/NewsSearch"
import { PageHero } from "@/components/ui/page-hero"

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Notícias - PMMirim Portal',
  description: 'Confira todas as notícias e atividades da Polícia Mirim.',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsIndexPage(props: Props) {
  const searchParams = await props.searchParams;

  const termoBusca = (searchParams.busca as string) || "";
  const categoriaAtual = (searchParams.categoria as string) || undefined;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      type: categoriaAtual ? (categoriaAtual as PostType) : undefined,
      OR: termoBusca
        ? [
          { title: { contains: termoBusca } },
          { summary: { contains: termoBusca } },
        ]
        : undefined,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero
        title="Notícias & Eventos"
        subtitle="Fique por dentro das últimas novidades e atividades."
        icon={Newspaper}
        themeColor="red"
        bgColor="bg-red-950"
        bgImage="/bg/bg-noticias.png"
      />

      {/* 2. BARRA DE BUSCA (Centralizada e sobrepondo o banner) */}
      <div className="container mx-auto px-4 relative -mt-6 z-30 mb-10">
        <div className="max-w-xl mx-auto pt-6 shadow-2xl rounded-xl bg-white overflow-hidden border border-slate-100">
          <NewsSearch />
        </div>
      </div>

      {/* 3. GRID DE NOTÍCIAS (Agora dentro de um CONTAINER para alinhar as margens) */}
      <section className="container mx-auto px-4 pb-20">
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group h-full block">
                <article className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">

                  {/* Imagem */}
                  <div className="h-56 w-full relative bg-slate-200 overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-100">
                        <Newspaper size={40} opacity={0.2} />
                      </div>
                    )}

                    {/* Overlay Vermelho no Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    {/* Badge de Categoria */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-red-700 text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm border border-white/50">
                        {post.type === 'NEWS' && 'Notícia'}
                        {post.type === 'EVENT' && 'Evento'}
                        {post.type === 'ACTIVITY' && 'Atividade'}
                        {post.type === 'PROJECT' && 'Projeto'}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="text-xs text-red-600 mb-4 flex items-center gap-2 font-bold uppercase tracking-wide">
                      <CalendarDays size={14} />
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-red-700 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1 text-justify">
                      {post.summary}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100">
                      <span className="text-slate-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all group-hover:text-red-600">
                        Ler Completo <ArrowRight size={14} className="text-red-500" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm mt-8">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              Não encontramos nada com os termos pesquisados. Tente mudar a categoria ou simplificar sua busca.
            </p>
          </div>
        )}

        {/* Botão Voltar Padronizado */}
        <BackButton className="mt-16" />
      </section>
    </main>
  )
}