import { prisma } from "@/lib/prisma"
import { updateInstitutionHistory } from "@/app/actions/institution"
import { HistoryForm } from "@/components/admin/HistoryForm"
import { History as HistoryIcon } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HistoryPage() {
  // Busca os dados da tabela correta
  const historyData = await prisma.institutionHistory.findFirst()

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 md:pl-16 md:pr-8">
      
      {/* Cabeçalho */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <HistoryIcon className="text-blue-600" size={32} />
          História & Identidade
        </h1>
        <p className="text-slate-500 mt-1 text-lg">
          Gerencie a história, missão, visão e valores da instituição.
        </p>
      </div>

      {/* Formulário */}
      <HistoryForm 
        // CORREÇÃO: Passando todos os campos (se existirem) ou undefined
        data={historyData ? {
            id: historyData.id,
            title: historyData.title,
            content: historyData.content,
            mission: historyData.mission,
            vision: historyData.vision,
            values: historyData.values,
            principles: historyData.principles,
        } : null} 
        action={updateInstitutionHistory} 
      />
      
    </div>
  )
}