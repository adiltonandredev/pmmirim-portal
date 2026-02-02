import { prisma } from "@/lib/prisma"
import { deleteFeaturedStudent } from "@/app/actions/students"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Star, Pencil, Trophy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function FeaturedStudentPage() {
  // Ordena pelos mais recentes criados
  const students = await prisma.featuredStudent.findMany({ 
      orderBy: { createdAt: 'desc' } 
  })

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
         <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Alunos Destaque
            </h1>
            <p className="text-slate-500 mt-1">Gerencie o histórico de alunos honrados pela instituição.</p>
         </div>
         <Link href="/admin/featured-student/new">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold gap-2">
                <Plus size={20} /> Novo Destaque
            </Button>
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
            <div key={student.id} className={`bg-white rounded-xl shadow-sm border p-4 flex gap-4 transition-all ${student.active ? 'border-yellow-200 shadow-yellow-100' : 'border-slate-200 opacity-75'}`}>
                
                {/* FOTO */}
                <div className="h-20 w-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 relative">
                    {student.photoUrl ? (
                        <Image src={student.photoUrl} alt={student.studentName} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Star size={20} />
                        </div>
                    )}
                </div>

                {/* DADOS */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wide bg-yellow-50 w-fit px-2 py-0.5 rounded mb-1">
                        {student.month}/{student.year}
                    </span>
                    <h3 className="font-bold text-slate-800 truncate leading-tight">{student.studentName}</h3>
                    <p className="text-xs text-slate-500 truncate">{student.achievement}</p>
                    
                    {!student.active && <span className="text-[10px] text-red-500 font-bold mt-1">Inativo</span>}
                </div>

                {/* AÇÕES */}
                <div className="flex flex-col justify-center gap-1 border-l pl-2 border-slate-100">
                    <Link href={`/admin/featured-student/${student.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil size={16} />
                        </Button>
                    </Link>

                    {/* Form Delete Seguro (Sem .bind) */}
                    <form action={deleteFeaturedStudent}>
                        <input type="hidden" name="id" value={student.id} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                        </Button>
                    </form>
                </div>
            </div>
        ))}

        {students.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                <p>Nenhum aluno destaque cadastrado ainda.</p>
            </div>
        )}
      </div>
    </div>
  )
}