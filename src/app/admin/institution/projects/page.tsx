import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, Pencil, Calendar } from "lucide-react"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton"
import { deleteProject } from "@/app/actions/projects"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const projects = await prisma.post.findMany({
    where: { type: "PROJECT" },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Projetos Sociais" 
            subtitle="Iniciativas e ações sociais da instituição."
            icon={Briefcase} 
        />
        <Link href="/admin/institution/projects/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold gap-2 shadow-md">
            <Plus size={18} /> Novo Projeto
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
                // CORREÇÃO AQUI: Aceita imagens locais (/)
                const hasImage = project.coverImage && (
                    project.coverImage.startsWith('data:') || 
                    project.coverImage.startsWith('http') || 
                    project.coverImage.startsWith('/')
                );

                return (
                <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-green-300 transition-all">
                    
                    {/* CAPA */}
                    <div className="relative h-48 bg-slate-100 border-b border-slate-100">
                        {hasImage ? (
                            <Image 
                                src={project.coverImage!} 
                                alt={project.title} 
                                fill 
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300">
                                <Briefcase size={40} />
                            </div>
                        )}

                        <div className="absolute top-2 right-2">
                             {project.published ? (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm">PUBLICADO</span>
                             ) : (
                                <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm">RASCUNHO</span>
                             )}
                        </div>
                    </div>

                    {/* DADOS */}
                    <div className="p-5 flex flex-col gap-2 flex-1">
                        <h3 className="font-bold text-slate-800 line-clamp-1 text-lg">{project.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2 h-10">{project.summary || "Sem resumo."}</p>
                        
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                            <Calendar size={12}/> {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                        </div>

                        {/* AÇÕES */}
                        <div className="mt-auto pt-4 flex items-center justify-end gap-2 border-t border-slate-50">
                            <Link href={`/admin/institution/projects/${project.id}/edit`}>
                                <Button variant="outline" size="sm" className="h-9 px-3 text-slate-600 border-slate-200 hover:border-green-300 hover:text-green-700 text-xs font-bold">
                                    <Pencil size={14} className="mr-2" /> Editar
                                </Button>
                            </Link>

                            <DeleteButton 
                                action={deleteProject} 
                                itemId={project.id} 
                                itemName={project.title}
                                className="h-9 w-9 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )})}
        </div>
        
        {projects.length === 0 && (
            <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
                <h3 className="text-sm font-bold text-slate-700">Nenhum projeto cadastrado</h3>
                <Link href="/admin/institution/projects/new" className="mt-4 inline-block">
                    <Button variant="outline">Criar Primeiro Projeto</Button>
                </Link>
            </div>
        )}
      </PageContent>
    </PageContainer>
  )
}