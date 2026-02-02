"use client"

import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = [
  { label: "Todos", value: null },
  { label: "Notícias", value: "NEWS" },
  { label: "Eventos", value: "EVENT" },
  { label: "Atividades", value: "ACTIVITY" },
  { label: "Projetos", value: "PROJECT" },
]

export function NewsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pega os valores atuais da URL
  const currentCategory = searchParams.get("categoria")
  const currentSearch = searchParams.get("busca") || ""

  const [searchTerm, setSearchTerm] = useState(currentSearch)

  // Função que atualiza a URL quando clica ou pesquisa
  function updateFilters(newCategory?: string | null, newSearch?: string) {
    const params = new URLSearchParams()

    // Lógica da Categoria
    const category = newCategory !== undefined ? newCategory : currentCategory
    if (category) params.set("categoria", category)

    // Lógica da Busca
    const search = newSearch !== undefined ? newSearch : searchTerm
    if (search) params.set("busca", search)

    // Empurra a nova URL para o navegador
    router.push(`/noticias?${params.toString()}`)
  }

  return (
    <div className="w-full">
      {/* BARRA DE PESQUISA */}
      <div className="max-w-lg mx-auto mb-8 relative">
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            updateFilters(undefined, searchTerm)
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text" 
              placeholder="Pesquisar por assunto..." 
              className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm"
            />
          </div>
          <Button type="submit" className="rounded-full px-6 bg-blue-600 hover:bg-blue-700">
            Buscar
          </Button>
        </form>
      </div>

      {/* BOTÕES DE FILTRO */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value || (!currentCategory && !cat.value)
          
          return (
            <button
              key={cat.label}
              onClick={() => updateFilters(cat.value)}
              className={`
                px-5 py-2 rounded-full text-sm font-bold transition-all
                ${isActive 
                  ? "bg-blue-600 text-white shadow-md scale-105" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-blue-300"}
              `}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* FEEDBACK VISUAL (Se tiver filtro ativo) */}
      {(currentSearch || currentCategory) && (
        <div className="flex items-center gap-2 justify-center mb-8">
           <span className="text-slate-500 text-sm">Filtros:</span>
           {currentSearch && <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-md font-bold">"{currentSearch}"</span>}
           {currentCategory && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-bold">{categories.find(c => c.value === currentCategory)?.label}</span>}
           
           <button 
             onClick={() => {
               setSearchTerm("")
               router.push("/noticias")
             }}
             className="ml-2 text-red-500 hover:bg-red-50 p-1 rounded-full"
             title="Limpar tudo"
           >
             <X size={16} />
           </button>
        </div>
      )}
    </div>
  )
}