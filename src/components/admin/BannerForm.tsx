"use client"

import { updateBanner, createBanner } from "@/app/actions/banners"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef } from "react"
import { Save, Loader2, Info, UploadCloud, AlertTriangle, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Feedback

interface BannerFormProps {
  banner?: any
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState(banner?.type || "HOME")
  const [preview, setPreview] = useState(banner?.imageUrl || null)
  const formRef = useRef<HTMLFormElement>(null)

  // Validação de Imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Formato
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
         toast.error("Formato inválido!", {
             description: "Apenas JPG, PNG ou WEBP.",
             icon: <AlertTriangle className="text-red-500" />
         });
         e.target.value = "";
         return;
      }
      // Tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
         toast.warning("Arquivo muito pesado!", { description: "Máximo 5MB." });
         e.target.value = "";
         return;
      }
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
      setPreview(null)
      if (formRef.current) {
          const input = formRef.current.querySelector('input[name="image"]') as HTMLInputElement;
          if (input) input.value = "";
      }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    
    try {
        let result;
        if (banner?.id) {
            formData.append("id", banner.id)
            // Se não trocou a imagem, manda a URL antiga
            if (!formData.get("image") || (formData.get("image") as File).size === 0) {
                if (banner.imageUrl) formData.append("existingImageUrl", banner.imageUrl);
            }
            result = await updateBanner(formData)
        } else {
            result = await createBanner(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(banner?.id ? "Banner atualizado!" : "Banner criado com sucesso!")
            router.push("/admin/banners")
            router.refresh()
        }
    } catch (error) {
        console.error("Erro:", error)
        toast.error("Erro inesperado.")
    }
    setLoading(false)
  }

  // Helper para mostrar o tamanho recomendado
  const getSizeRecommendation = () => {
    switch(type) {
        case 'HOME': return "1920 x 600 px";
        case 'PARTNER': return "300 x 150 px";
        case 'SPONSOR': return "1080 x 1080 px";
        default: return "Tamanho padrão";
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        
        {/* CARD INICIAL: TIPO E REQUISITOS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-3">
                <Label>Local de Exibição</Label>
                <Select name="type" defaultValue={type} onValueChange={setType}>
                    <SelectTrigger className="w-full md:w-1/2">
                        <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="HOME">Banner Principal (Home)</SelectItem>
                        <SelectItem value="PARTNER">Parceiros</SelectItem>
                        <SelectItem value="SPONSOR">Patrocinadores</SelectItem>
                    </SelectContent>
                </Select>

                {/* Box Azul de Informação */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-700 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Info className="shrink-0 mt-0.5 text-blue-500" size={18} />
                    <div className="space-y-1">
                        <p className="font-bold text-xs md:text-sm">Requisitos para Banner {type === 'HOME' ? 'Principal' : type === 'PARTNER' ? 'Parceiros' : 'Patrocinadores'}:</p>
                        <ul className="list-disc pl-4 space-y-0.5 opacity-90 text-[10px] md:text-xs">
                            <li>Tamanho ideal: <strong>{getSizeRecommendation()}</strong></li>
                            <li>Formatos: JPG ou PNG (Máx 5MB)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* CARD DADOS */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="title">Título (Opcional)</Label>
                <Input id="title" name="title" defaultValue={banner?.title} placeholder="Ex: Curso de Informática" className="h-11" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input id="order" name="order" type="number" defaultValue={banner?.order || 0} className="h-11 md:w-32" />
            </div>
            
            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" defaultValue={banner?.description} rows={2} placeholder="Breve descrição..." className="resize-none" />
            </div>

            <div className="md:col-span-2 space-y-2">
                <Label htmlFor="link">Link de Destino</Label>
                <Input id="link" name="link" defaultValue={banner?.link} placeholder="https://..." className="h-11" />
            </div>
        </div>

        {/* CARD STATUS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="space-y-0.5">
                <Label className="text-sm font-bold">Status do Banner</Label>
                <p className="text-[10px] text-slate-500">Ocultar/Mostrar no site.</p>
            </div>
            <Switch name="active" defaultChecked={banner?.active ?? true} />
        </div>

        {/* CARD UPLOAD */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <Label>Imagem do Banner</Label>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors bg-slate-50/50 group relative">
                
                {preview ? (
                    <div className="relative w-full aspect-video max-h-64 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="bg-white/90 text-slate-700 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-sm flex items-center gap-2">
                                <UploadCloud size={14}/> Alterar Imagem
                            </span>
                        </div>
                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10 transition-transform hover:scale-110">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        <p className="text-sm text-slate-600 font-bold">Clique ou arraste para enviar</p>
                        <p className="text-xs text-slate-400 mt-1">Recomendado: <strong>{getSizeRecommendation()}</strong></p>
                        <p className="text-[10px] text-slate-400 uppercase mt-2 font-medium bg-slate-100 px-2 py-1 rounded">JPG, PNG (Máx 5MB)</p>
                    </div>
                )}

                <Input 
                    type="file" 
                    name="image" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageChange}
                />
            </div>
        </div>

        {/* BOTÃO SALVAR (STICKY) */}
        <div className="fixed bottom-6 right-6 z-50 md:static md:bottom-auto md:right-auto md:pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white h-12 px-8 shadow-xl shadow-blue-200/50 rounded-xl transition-all hover:-translate-y-1">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                Salvar Alterações
            </Button>
        </div>

    </form>
  )
}