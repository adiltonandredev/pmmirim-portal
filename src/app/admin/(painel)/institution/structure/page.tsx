import { Button } from "@/components/ui/button"
import { Network } from "lucide-react"

export default function AdminStructurePage() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      
      {/* CABEÇALHO PADRÃO */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Network className="text-blue-600" />Estrutura Organizacional
        </h1>
        <p className="text-slate-500">Gerencie o organograma da instituição.</p>
      </div>

      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
        <h3 className="text-xl font-bold text-slate-700 mb-2">Em Construção</h3>
        <p className="text-slate-500 mb-6">Estamos finalizando o módulo de organograma gráfico.</p>
        <Button disabled>Adicionar Nível Hierárquico</Button>
      </div>
    </div>
  )
}