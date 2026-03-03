import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, BookOpen, Clock, Users, Image as ImageIcon, Calendar } from "lucide-react"
import { deleteCourse } from "@/app/actions/courses"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { DeleteButton } from "@/components/admin/DeleteButton" // <--- Importamos o botão seguro

export const dynamic = "force-dynamic"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Gestão de Cursos" 
            subtitle="Gerencie o catálogo de cursos e turmas oferecidas." 
            icon={BookOpen} 
        />
        <Link href="/admin/courses/new" className="w-full md:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-md w-full md:w-auto">
            <Plus size={18} /> Novo Curso
          </Button>
        </Link>
      </PageHeader>

      <PageContent>
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-blue-300 transition-all group">
              
              {/* 1. MINIATURA DA FOTO (Responsiva: Grande no mobile, pequena no PC) */}
              <div className="w-full md:w-40 h-48 md:h-28 relative bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                  {course.coverImage ? (
                      <Image 
                          src={course.coverImage} 
                          alt={course.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                          <ImageIcon size={24} />
                          <span className="text-[10px] uppercase font-bold">Sem foto</span>
                      </div>
                  )}
                  
                  {/* Badge de Status flutuante na imagem (Mobile) ou Texto normal (Desktop) */}
                  <div className="absolute top-2 left-2 md:hidden">
                      {course.active ? (
                          <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">Ativo</span>
                      ) : (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">Inativo</span>
                      )}
                  </div>
              </div>

              {/* 2. CONTEÚDO */}
              <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-lg font-bold text-slate-800 truncate">{course.title}</h2>
                      
                      {/* Badges para Desktop */}
                      <div className="hidden md:block">
                        {!course.active && (
                            <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Inativo</span>
                        )}
                        {course.active && (
                            <span className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Ativo</span>
                        )}
                      </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {course.description || "Sem descrição definida."}
                  </p>
                  
                  {/* Tags Informativas */}
                  <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {course.duration && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              <Clock size={14} className="text-blue-500"/> {course.duration}
                          </div>
                      )}
                      {course.targetAge && (
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              <Users size={14} className="text-purple-500"/> {course.targetAge}
                          </div>
                      )}
                  </div>
              </div>

              {/* 3. AÇÕES (Botões) */}
              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0 md:border-l md:pl-5 self-stretch md:self-center justify-end">
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <Button variant="outline" size="sm" className="text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 font-bold h-10 px-4 md:h-9 md:px-3">
                    <Pencil size={16} className="mr-2" /> Editar
                  </Button>
                </Link>
                
                {/* BOTÃO DELETAR SEGURO */}
                <DeleteButton 
                    action={deleteCourse} 
                    itemId={course.id} 
                    itemName={`o curso "${course.title}"`}
                    className="h-10 w-10 md:h-9 md:w-9 p-0 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors shadow-sm"
                />
              </div>
            </div>
          ))}

          {/* Estado Vazio */}
          {courses.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <BookOpen className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-lg">Nenhum curso cadastrado</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-6 max-w-xs mx-auto">
                      Adicione os cursos que a Polícia Mirim oferece.
                  </p>
                  <Link href="/admin/courses/new">
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold">
                        Cadastrar Primeiro Curso
                    </Button>
                  </Link>
              </div>
          )}
        </div>
      </PageContent>
    </PageContainer>
  )
}