"use client"

import { updateProject, createProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState, useRef } from "react"
import { Save, Loader2, UploadCloud, Image as ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RichTextEditor } from "@/components/admin/RichTextEditor"

interface ProjectFormProps {
  project?: any
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(project?.coverImage || null)
  const [content, setContent] = useState(project?.content || "")
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) { 
         toast.warning("Arquivo muito pesado!", { description: "Recomendado até 20MB." });
         e.target.value = "";
         return;
      }
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
      setPreview(null)
      if (formRef.current) {
          const input = formRef.current.querySelector('input[name="coverImage"]') as HTMLInputElement;
          if (input) input.value = "";
      }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    formData.set("content", content) // Adiciona RichText

    try {
        let result;
        if (project?.id) {
            formData.append("id", project.id)
            if (!formData.get("coverImage") || (formData.get("coverImage") as File).size === 0) {
                if (project.coverImage) formData.append("existingCoverImage", project.coverImage);
            }
            result = await updateProject(formData)
        } else {
            result = await createProject(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(project?.id ? "Projeto atualizado!" : "Projeto criado com sucesso!")
            
            // REDIRECIONA PARA A ROTA CORRETA
            router.push("/admin/institution/projects")
            router.refresh()
        }
    } catch (error) {
        toast.error("Erro inesperado.")
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="space-y-2">
                        <Label>Título do Projeto *</Label>
                        <Input name="title" defaultValue={project?.title} required placeholder="Ex: Projeto Polícia Mirim na Escola" className="h-12 text-lg font-bold" />
                    </div>

                    <div className="space-y-2">
                        <Label>Resumo Curto (Para o Card)</Label>
                        <Textarea name="summary" defaultValue={project?.summary} rows={3} placeholder="Breve descrição que aparece na listagem..." className="resize-none" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <Label className="font-bold text-slate-700">Conteúdo Completo</Label>
                    <div className="min-h-[400px]">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="font-bold">Publicar Projeto?</Label>
                        <p className="text-xs text-slate-500">Se desligado, fica como rascunho.</p>
                    </div>
                    <Switch name="published" defaultChecked={project?.published ?? true} />
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <Label className="font-bold text-slate-700">Capa do Projeto</Label>
                    
                    <div className="relative w-full aspect-video bg-slate-50 rounded-lg overflow-hidden border-2 border-dashed border-slate-200 hover:border-green-400 transition-colors group cursor-pointer">
                        {preview ? (
                            <>
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white pointer-events-none">
                                    <UploadCloud size={32} className="mb-1"/> <span className="text-xs font-bold">Trocar Capa</span>
                                </div>
                                <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md z-30 hover:scale-110"><X size={14}/></button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center pointer-events-none">
                                <ImageIcon size={40} className="text-slate-300 mb-2" />
                                <span className="text-xs font-bold text-slate-500">Adicionar Capa</span>
                            </div>
                        )}

                        <input 
                            type="file" 
                            name="coverImage" 
                            accept="image/png, image/jpeg, image/webp" 
                            onChange={handleImageChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                        />
                    </div>
                    <p className="text-[10px] text-center text-slate-400">Recomendado: 1280x720 (Horizontal)</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 font-bold text-white h-12 shadow-md rounded-xl">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    Salvar Projeto
                </Button>
            </div>
        </div>
    </form>
  )
}