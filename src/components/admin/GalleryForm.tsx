"use client"

import { updateGalleryItem, createGalleryItem } from "@/server/actions/gallery"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Save, Loader2, UploadCloud, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface GalleryFormProps {
  item?: {
    id: string
    title: string
    imageUrl: string
  }
}

export function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(item?.imageUrl || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  // Mudamos para uma função assíncrona que o form chama no action
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      let result: any
      
      if (item?.id) {
        // Forçamos a tipagem como any aqui para o TS parar de reclamar do formData
        result = await (updateGalleryItem as any)(item.id, formData)
      } else {
        // Forçamos a tipagem como any aqui para o TS parar de reclamar do import
        result = await (createGalleryItem as any)(formData)
      }

      if (result?.success) {
        toast.success(item?.id ? "Atualizado com sucesso!" : "Criado com sucesso!")
        router.push("/admin/gallery")
        router.refresh()
      } else {
        toast.error(result?.message || "Erro ao salvar")
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao processar a requisição")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
            <Label htmlFor="title" className="font-bold">Legenda / Título</Label>
            <Input 
              id="title" 
              name="title" 
              defaultValue={item?.title || ""} 
              placeholder="Ex: Inauguração da Quadra..." 
              required 
              className="rounded-xl h-11" 
            />
        </div>

        <div className="space-y-2 pt-2">
            <Label className="font-bold">Foto da Galeria</Label>
            
            <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors bg-white group">
                {preview ? (
                    <div className="relative w-full aspect-[4/3] max-h-64 rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-100 shadow-sm">
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Trocar Imagem</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                        <UploadCloud size={32} />
                    </div>
                )}

                <input 
                    type="file" 
                    name="imageUrl" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    accept="image/*" 
                    onChange={handleImageChange}
                />
                
                <div className="space-y-1">
                    <p className="text-sm text-slate-600 font-bold">
                        {preview ? "Clique para alterar" : "Clique ou arraste o arquivo"}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Formatos aceitos: JPG, PNG (Máx 4MB)</p>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white px-8 h-12 rounded-xl shadow-lg shadow-blue-100 transition-all"
            >
                {loading ? (
                    <Loader2 className="animate-spin mr-2" />
                ) : item?.id ? (
                    <Save className="mr-2" size={18} />
                ) : (
                    <Plus className="mr-2" size={18} />
                )}
                {item?.id ? "Salvar Alterações" : "Publicar na Galeria"}
            </Button>
        </div>
    </form>
  )
}