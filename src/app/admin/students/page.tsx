import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Plus, Search, User, GraduationCap, Edit, Trash2 } from "lucide-react"
import { deleteStudent } from "@/app/actions/students"
import { DeleteButton } from "@/components/admin/DeleteButton" // Reaproveitando seu botão

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { name: 'asc' },
    include: { reports: true } // Trazemos os boletins para contar quantos tem
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">👮‍♂️ Tropa (Alunos)</h1>
          <p className="text-slate-500">Gerencie o cadastro e acompanhamento escolar.</p>
        </div>
        
        <Link 
          href="/admin/students/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus size={20} />
          Novo Aluno
        </Link>
      </div>

      {/* LISTA DE ALUNOS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Aluno</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Matrícula</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Escola / Série</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                
                {/* NOME E FOTO */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                      {student.photoUrl ? (
                        <Image src={student.photoUrl} alt={student.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.phone || "Sem telefone"}</div>
                    </div>
                  </div>
                </td>

                {/* MATRÍCULA */}
                <td className="px-6 py-4">
                    <span className="font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">
                        {student.matricula}
                    </span>
                </td>

                {/* ESCOLA */}
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-700">{student.schoolName || "Escola não informada"}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{student.schoolGrade}</span>
                            {student.shift && <span>• {student.shift}</span>}
                        </div>
                    </div>
                </td>

                {/* BOTÕES */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {/* Botão de Boletim (Futuro) */}
                    <Link 
                        href={`/admin/students/${student.id}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-all"
                        title="Ver Boletim e Detalhes"
                    >
                        <GraduationCap size={18} />
                    </Link>

                    {/* Botão Editar */}
                    <Link 
                        href={`/admin/students/${student.id}/edit`} 
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all"
                    >
                        <Edit size={18} />
                    </Link>

                    {/* Botão Excluir */}
                    <DeleteButton 
                        action={deleteStudent} 
                        itemId={student.id} 
                        itemName={student.name} // IMPORTANTE: Passar o nome para não dar erro no TypeScript
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    />
                  </div>
                </td>
              </tr>
            ))}
            
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                        <User size={40} className="text-slate-300" />
                        <p>Nenhum aluno cadastrado ainda.</p>
                        <p className="text-sm">Clique em "Novo Aluno" para começar.</p>
                    </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}