import { createStudent } from "@/app/actions/students"
import { SubmitButton } from "@/components/admin/SubmitButton" 
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewStudentPage() {
  
  // Função "Envelope" para agradar o TypeScript
  async function handleSave(formData: FormData) {
    "use server"
    await createStudent(formData)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Novo Aluno</h1>
      </div>

      {/* 👇 MUDANÇA AQUI: Usamos o handleSave em vez do createStudent direto */}
      <form action={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* DADOS DE ACESSO */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2 flex items-center gap-2">
                🔐 Acesso ao Portal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Matrícula (Login) *</label>
                    <input name="matricula" required placeholder="Ex: 2024001" className="w-full p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Senha Inicial *</label>
                    <input name="password" type="password" required placeholder="******" className="w-full p-2 border rounded-md" />
                </div>
            </div>
        </div>

        {/* DADOS PESSOAIS */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">👤 Dados Pessoais</h3>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome Completo *</label>
                <input name="name" required placeholder="Nome do Aluno" className="w-full p-2 border rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Data de Nascimento</label>
                    <input name="birthDate" type="date" className="w-full p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">CPF</label>
                    <input name="cpf" placeholder="000.000.000-00" className="w-full p-2 border rounded-md" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Telefone (Pais)</label>
                    <input name="phone" placeholder="(69) 99999-9999" className="w-full p-2 border rounded-md" />
                </div>
            </div>

            <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Foto (Opcional)</label>
                 <input name="photo" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>
        </div>

        {/* ESCOLA REGULAR */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 border-b pb-2">🏫 Escola Regular</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nome da Escola</label>
                    <input name="schoolName" placeholder="Ex: Escola Carlos Drummond" className="w-full p-2 border rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Série/Ano</label>
                        <input name="schoolGrade" placeholder="Ex: 7º Ano B" className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Turno</label>
                        <select name="shift" className="w-full p-2 border rounded-md bg-white">
                            <option value="">Selecione...</option>
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                            <option value="Noturno">Noturno</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-4 flex justify-end">
             <SubmitButton text="Cadastrar Aluno" />
        </div>

      </form>
    </div>
  )
}