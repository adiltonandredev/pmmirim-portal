import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Clock, Calendar, Users, GraduationCap } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { PageHero } from "@/components/ui/page-hero"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const course = await prisma.course.findFirst({ where: { slug: params.slug } })
  if (!course) return { title: 'Curso não encontrado' }
  return { title: `${course.title} - PMMirim`, description: course.description }
}

export default async function CourseDetailsPage(props: Props) {
  const params = await props.params;
  
  const courseRaw = await prisma.course.findFirst({
    where: { slug: params.slug }
  })

  if (!courseRaw) return notFound()

  // --- TRUQUE PARA REMOVER OS SUBLINHADOS VERMELHOS ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const course: any = courseRaw; 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <PageHero 
        title={course.title}
        subtitle={course.description || "Detalhes sobre este curso."}
        icon={GraduationCap}
        themeColor="green"        
        bgColor="bg-green-950"   
        bgImage={course.imageUrl || "/bg/bg-cursos.png"} 
        backLink="/cursos"
        backText="Voltar para Cursos"
      />

      <main className="flex-1 container mx-auto px-4 py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 -mt-20 space-y-12">
            <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4 flex items-center gap-2">
                 <GraduationCap className="text-green-600" /> Sobre o Curso
              </h2>
              <div className="prose prose-lg max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed text-justify">
                {course.description || "Conteúdo programático em breve."}
              </div>
            </section>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6 -mt-20">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Ficha Técnica</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Clock size={20} /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Duração</p>
                    <p className="text-slate-800 font-bold">{course.duration || "Não informado"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><Users size={20} /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Público Alvo</p>
                    <p className="text-slate-800 font-bold">{course.targetAge || "Livre"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                  <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Calendar size={20} /></div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Dias e Horários</p>
                    <p className="text-slate-800 font-bold">{course.schedule || "A definir"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BackButton className="mt-16" />
      </main>
    </div>
  )
}