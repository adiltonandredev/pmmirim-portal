"use client"

import { createGallery } from "@/app/actions/gallery"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/PageLayout"
import { Loader2, Save, UploadCloud, FolderPlus, X, RefreshCcw, AlertCircle, FileImage, Maximize2, ImagePlus } from "lucide-react"

export default function NewGalleryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])

  const validateFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 4 * 1024 * 1024 // 4MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, msg: "Formato inválido! Use JPG ou PNG." }
    }
    if (file.size > maxSize) {
      return { isValid: false, msg: "Arquivo muito grande! Máximo 4MB." }
    }
    return { isValid: true }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (file) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        setError(validation.msg || "Erro no arquivo")
        setPreview(null)
        e.target.value = ""
        return
      }
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreview(null)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!preview) {
        setError("A capa é obrigatória! Selecione uma imagem.")
        return
    }
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const newId = await createGallery(formData)
    
    if (newId) router.push(`/admin/gallery/${newId}/edit`)
    else router.push("/admin/gallery")
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle 
            title="Novo Álbum" 
            subtitle="Crie a pasta inicial e defina a capa do evento." 
            icon={FolderPlus} 
            backLink="/admin/gallery" 
        />
      </PageHeader>

      <PageContent>
        {/* Adicionei pb-20 para garantir espaço de rolagem no final */}
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-20">
            
            <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[1fr_1.5fr]">
                
                {/* COLUNA 1: NOME E DICAS (Fica embaixo no mobile) */}
                <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
                    <div className="space-y-3 bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
                        <Label htmlFor="title" className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                            <FolderPlus size={18} className="text-blue-600" /> Nome do Álbum
                        </Label>
                        <Input 
                            id="title" 
                            name="title" 
                            placeholder="Ex: Formatura Proerd 2026" 
                            required 
                            className="text-base md:text-lg py-5 md:py-6 shadow-sm border-slate-300 focus:border-blue-500 bg-slate-50"
                        />
                        <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mt-1">
                            Este nome aparecerá no título da página e na URL.
                        </p>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 md:p-5 text-blue-900 text-sm shadow-sm">
                        <h4 className="font-bold mb-3 flex items-center gap-2 text-blue-700 text-sm md:text-base">
                            <ImagePlus size={18} /> Importância da Capa
                        </h4>
                        <div className="space-y-2 text-xs md:text-sm">
                            <div className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
                                <Maximize2 size={14} className="mt-0.5 text-blue-600 shrink-0" /> 
                                <span>Use fotos <strong>Horizontais</strong> (Paisagem).</span>
                            </div>
                            <div className="flex items-start gap-2 bg-white/60 p-2 rounded-lg">
                                <FileImage size={14} className="mt-0.5 text-blue-600 shrink-0" /> 
                                <span>Imagens nítidas e centralizadas.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUNA 2: UPLOAD (Fica em cima no mobile) */}
                <div className="space-y-3 order-1 lg:order-2">
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-base md:text-lg font-bold text-slate-800">
                           Capa de Destaque
                        </Label>
                        <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            Obrigatório
                        </span>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 text-red-700 px-3 py-3 rounded-xl flex items-center gap-3 text-sm border border-red-200 shadow-sm animate-in slide-in-from-top-2 font-medium mb-4">
                            <AlertCircle size={20} className="shrink-0 text-red-600" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div className="relative group w-full">
                        <label 
                            htmlFor="coverInput" 
                            className={`
                                relative flex flex-col items-center justify-center w-full aspect-video min-h-[220px] md:min-h-[300px] rounded-xl md:rounded-2xl cursor-pointer transition-all overflow-hidden bg-white
                                ${error ? 'border-2 md:border-4 border-red-200 ring-2 ring-red-50' : 
                                  preview ? 'border-0 shadow-lg ring-2 ring-blue-50' : 
                                  'border-2 md:border-4 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/30 shadow-sm'}
                            `}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                        <RefreshCcw size={32} className="mb-2 drop-shadow-lg" />
                                        <span className="font-bold text-xs md:text-sm uppercase tracking-wider border-2 border-white px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                                            Trocar
                                        </span>
                                    </div>
                                    
                                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 md:top-4 md:right-4 bg-white text-red-600 p-2 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all z-20 hover:scale-110">
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 md:p-8 text-center w-full h-full">
                                    <div className={`w-16 h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-3 md:mb-6 shadow-sm transition-transform duration-300 border-2 md:border-4 ${error ? 'bg-red-100 text-red-500 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-100 group-hover:scale-110'}`}>
                                        {error ? <X size={32} className="md:w-14 md:h-14" /> : <UploadCloud size={32} className="md:w-14 md:h-14" />}
                                    </div>
                                    <h3 className={`text-lg md:text-2xl font-bold mb-1 ${error ? 'text-red-700' : 'text-slate-800'}`}>
                                        {error ? "Arquivo recusado" : "Arraste a imagem"}
                                    </h3>
                                    <p className="text-slate-500 text-xs md:text-base font-medium mb-4 md:mb-8">
                                        ou clique para buscar
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] md:text-sm font-bold text-slate-600 bg-slate-100/80 px-4 py-2 md:px-8 md:py-4 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-sm border border-slate-100">
                                            <FileImage size={14} className="text-green-600 md:w-4 md:h-4" />
                                            <span>JPG/PNG</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-sm border border-slate-100">
                                            <Maximize2 size={14} className="text-orange-500 md:w-4 md:h-4" />
                                            <span>4MB</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <input 
                                id="coverInput" 
                                name="coverImage" 
                                type="file" 
                                accept="image/png, image/jpeg, image/webp" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* BOTÃO AGORA É ESTÁTICO (NORMAL) NO FIM DA PÁGINA */}
            {/* A margin-top (mt-8) e padding-bottom do form garantem que ele apareça */}
            <div className="mt-8 pt-6 border-t border-slate-200 order-3">
                <Button type="submit" disabled={loading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-12 md:h-14 px-6 md:px-10 text-base md:text-lg shadow-xl shadow-green-100/50 transition-all rounded-xl flex items-center justify-center gap-3 ml-auto">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={20} className="md:w-6 md:h-6" />}
                    {loading ? "Salvando..." : "Salvar e Continuar"}
                </Button>
            </div>

        </form>
      </PageContent>
    </PageContainer>
  )
}