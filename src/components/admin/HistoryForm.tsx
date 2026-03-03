"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, History, FileText, Type, Target, Eye, Heart, BookOpen, Loader2 } from "lucide-react"
import { toast } from "sonner"
// MANTIDO: O editor correto
import { RichTextEditor } from "@/components/admin/RichTextEditor"; 

interface HistoryData {
  id?: string
  title: string
  content: string
  mission?: string | null
  vision?: string | null
  values?: string | null
  principles?: string | null
}

interface HistoryFormProps {
  data?: HistoryData | null
  action: (formData: FormData) => Promise<any>
}

export function HistoryForm({ data, action }: HistoryFormProps) {
  const [content, setContent] = useState(data?.content || "")
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    try {
        // Injeta o conteúdo do editor manualmente
        formData.set("content", content)
        
        await action(formData)
        toast.success("História atualizada com sucesso!")
    } catch (error) {
        console.error(error)
        toast.error("Erro ao salvar. Tente novamente.")
    } finally {
        setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Input escondido removido pois injetamos via formData.set() no handleSubmit */}
      
      {data?.id && <input type="hidden" name="id" value={data.id} />}

      {/* BLOCO 1: CONTEÚDO */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
             <FileText className="text-blue-600" size={20}/> Conteúdo da Página
        </h2>

        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Type size={16} /> Título da Página
                </label>
                <input 
                    name="title" 
                    defaultValue={data?.title || "Nossa História"} 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-lg text-slate-800"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <History size={16} /> Texto Completo da História
                </label>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                    {/* AQUI ESTÁ A CORREÇÃO: USANDO O EDITOR MESTRE */}
                    <RichTextEditor content={content} onChange={setContent} />
                </div>
            </div>
        </div>
      </div>

      {/* BLOCO 2: IDENTIDADE */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
             <Target className="text-blue-600" size={20}/> Identidade Organizacional
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Target size={16} /> Missão</label>
                <textarea name="mission" defaultValue={data?.mission || ""} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ex: Formar cidadãos..." />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Eye size={16} /> Visão</label>
                <textarea name="vision" defaultValue={data?.vision || ""} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ex: Ser referência..." />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Heart size={16} /> Valores</label>
                <textarea name="values" defaultValue={data?.values || ""} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ex: Ética, Respeito..." />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><BookOpen size={16} /> Princípios</label>
                <textarea name="principles" defaultValue={data?.principles || ""} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ex: Hierarquia..." />
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <Button 
                type="submit" 
                disabled={isPending} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 shadow-lg hover:shadow-green-500/20 transition-all min-w-[150px]"
            >
                {isPending ? (
                    <> <Loader2 className="mr-2 animate-spin" size={20} /> Salvando... </>
                ) : (
                    <> <Save className="mr-2" size={20} /> Salvar Tudo </>
                )}
            </Button>
        </div>
      </div>
    </form>
  )
}