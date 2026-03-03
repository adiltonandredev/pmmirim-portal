"use client"

import { updateGalleryItem, createGalleryItem } from "@/app/actions/gallery"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Save, Loader2, UploadCloud, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface GalleryFormProps {
  item?: any
}

export function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(item?.imageUrl || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Cria URL temporária para mostrar na hora
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
        if (item?.id) {
            // @ts-ignore
            await updateGalleryItem(item.id, formData)
        } else {
            // @ts-ignore
            await createGalleryItem(formData)
            router.push("/admin/gallery")
        }
    } catch (error) {
        console.error("Erro ao salvar:", error)
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-5">
        
        <div className="space-y-2">
            <Label htmlFor="title">Legenda / Título</Label>
            <Input id="title" name="title" defaultValue={item?.title || ""} placeholder="Ex: Inauguração da Quadra..." required />
        </div>

        <div className="space-y-2 pt-2">
            <Label>Foto da Galeria</Label>
            
            <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors bg-white group">
                
                {preview ? (
                    <div className="relative w-full aspect-[4/3] max-h-64 rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100 shadow-sm">
                        
                        {/* MUDANÇA: Usando <img> normal para garantir o preview */}
                        <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                        />
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="bg-white/90 text-slate-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-sm">
                                Trocar Foto
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform pointer-events-none">
                        <UploadCloud size={24} />
                    </div>
                )}

                <input 
                    type="file" 
                    name="imageUrl" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    accept="image/*" 
                    onChange={handleImageChange}
                />
                
                <div className="space-y-1 pointer-events-none">
                    <p className="text-xs text-slate-600 font-medium">
                        {preview ? "Clique na imagem para trocar" : "Clique ou arraste para fazer upload"}
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG (Máx 4MB)</p>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-200">
                {loading ? <Loader2 className="animate-spin mr-2" /> : item?.id ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                {item?.id ? "Salvar Alterações" : "Adicionar Foto"}
            </Button>
        </div>
    </form>
  )
}