import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Newspaper, Search, X, Calendar, Eye, Pencil } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deletePost } from "@/app/actions/posts"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function AdminNewsPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q || ""

  // FILTRA APENAS NOTÍCIAS (NEWS)
  const posts = await prisma.post.findMany({
    where: {
      type: "NEWS", // <--- Garante que só traz notícias
      OR: query ? [{ title: { contains: query } }] : undefined,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Gerenciar Notícias" 
            subtitle={`Total: ${posts.length} notícias publicadas.`}
            icon={Newspaper} 
        />
        <Link href="/admin/posts/new" className="w-full md:w-auto mt-3 md:mt-0">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm">
            <Plus size={18} /> Nova Notícia
          </Button>
        </Link>
      </PageHeader>

      <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm border border-slate-200 mt-4">
        <form className="relative flex items-center">
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar notícia por título..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {query && (
              <Link href="/admin/posts" className="absolute right-3 p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
              </Link>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {posts.map((post) => {
            // CORREÇÃO AQUI: Aceita imagens locais (/)
            const hasImage = post.coverImage && (
                post.coverImage.startsWith('data:') || 
                post.coverImage.startsWith('http') || 
                post.coverImage.startsWith('/')
            );

            return (
            <div key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-300 transition-all">
                
                {/* CAPA */}
                <div className="relative h-48 bg-slate-100 border-b border-slate-100">
                    {hasImage ? (
                        <Image 
                            src={post.coverImage!} 
                            alt={post.title} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-300">
                            <Newspaper size={40} />
                        </div>
                    )}

                    <div className="absolute top-2 right-2">
                            {post.published ? (
                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm">PUBLICADO</span>
                            ) : (
                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm">RASCUNHO</span>
                            )}
                    </div>
                </div>

                {/* DADOS */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-slate-800 line-clamp-2 text-sm leading-snug min-h-[2.5em]">{post.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 h-8">{post.summary || "Sem resumo."}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Calendar size={10}/> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        
                        <Link href={`/noticias/${post.slug}`} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                            <Eye size={10} /> Ver no site
                        </Link>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-700 text-xs font-bold">
                                <Pencil size={12} className="mr-1.5" /> Editar
                            </Button>
                        </Link>

                        <DeleteButton 
                            action={deletePost} 
                            itemId={post.id} 
                            itemName={post.title}
                            className="h-8 w-8 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                        />
                    </div>
                </div>
            </div>
        )})}
      </div>

      {posts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 mt-6">
             <Newspaper size={32} className="opacity-30 mx-auto mb-2" />
             <h3 className="text-sm font-bold text-slate-700">Nenhuma notícia encontrada</h3>
             <Link href="/admin/posts/new" className="inline-block mt-2">
                <Button variant="outline">Escrever Primeira Notícia</Button>
             </Link>
          </div>
      )}
    </PageContainer>
  )
}