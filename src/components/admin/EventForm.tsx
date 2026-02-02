"use client"

import { updateEvent, createEvent } from "@/app/actions/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef } from "react"
import { Save, Loader2, UploadCloud, Calendar as CalendarIcon, MapPin, AlertTriangle, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Importante para feedback

interface EventFormProps {
  event?: any
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(event?.bannerUrl || null)

  // Tratamento da Data para o input (YYYY-MM-DDTHH:MM)
  const defaultDate = event?.date 
    ? new Date(event.date).toISOString().slice(0, 16) 
    : ""

  // === VALIDAÇÃO DE IMAGEM ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // 1. Formato
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
         toast.error("Formato inválido!", {
             description: "Apenas JPG, PNG ou WEBP.",
             icon: <AlertTriangle className="text-red-500" />
         });
         e.target.value = "";
         return;
      }
      // 2. Tamanho (5MB)
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
          const input = formRef.current.querySelector('input[name="bannerUrl"]') as HTMLInputElement;
          if (input) input.value = "";
      }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    
    try {
        let result;
        if (event?.id) {
            formData.append("id", event.id)
            // Se não enviou imagem nova, envia a antiga se existir
            if (!formData.get("bannerUrl") || (formData.get("bannerUrl") as File).size === 0) {
                if (event.bannerUrl) formData.append("existingBannerUrl", event.bannerUrl);
            }
            result = await updateEvent(formData)
        } else {
            result = await createEvent(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(event?.id ? "Evento atualizado!" : "Evento agendado com sucesso!")
            router.push("/admin/events")
            router.refresh()
        }
    } catch (error) {
        console.error("Erro:", error)
        toast.error("Erro inesperado.")
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        
        {/* CARD PRINCIPAL */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            
            {/* LINHA 1: DATA E LOCAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2 uppercase text-xs font-bold text-slate-500">
                        <CalendarIcon size={14} className="text-green-600" /> Data e Horário *
                    </Label>
                    <Input 
                        id="date" 
                        name="date" 
                        type="datetime-local" 
                        defaultValue={defaultDate} 
                        required 
                        className="h-12 font-bold text-slate-700"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2 uppercase text-xs font-bold text-slate-500">
                        <MapPin size={14} className="text-red-500" /> Local do Evento
                    </Label>
                    <Input 
                        id="location" 
                        name="location" 
                        defaultValue={event?.location || ""} 
                        placeholder="Ex: Quadra da Escola, Sede..." 
                        className="h-12"
                    />
                </div>
            </div>

            {/* LINHA 2: TÍTULO */}
            <div className="space-y-2">
                <Label htmlFor="title" className="uppercase text-xs font-bold text-slate-500">Título do Evento *</Label>
                <Input id="title" name="title" defaultValue={event?.title || ""} placeholder="Ex: Festa Junina 2025" required className="h-12 text-lg font-bold" />
            </div>

            {/* LINHA 3: DESCRIÇÃO */}
            <div className="space-y-2">
                <Label htmlFor="description" className="uppercase text-xs font-bold text-slate-500">Descrição / Detalhes</Label>
                <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={event?.description || ""} 
                    rows={4} 
                    placeholder="Detalhes sobre o evento, atrações, requisitos..." 
                    className="resize-none"
                />
            </div>
        </div>

        {/* CARD BANNER */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <Label className="uppercase text-xs font-bold text-slate-500 flex items-center gap-2">
                <ImageIcon size={16} className="text-blue-500" /> Banner de Divulgação
            </Label>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors bg-slate-50/50 group relative">
                
                {preview ? (
                    <div className="relative w-full aspect-video max-h-[300px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        <Image src={preview} alt="Banner" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="bg-white/90 text-slate-700 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-sm flex items-center gap-2">
                                <UploadCloud size={14}/> Alterar Banner
                            </span>
                        </div>
                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10 transition-transform hover:scale-110">
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="py-8 flex flex-col items-center">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        <p className="text-sm text-slate-600 font-bold">Clique ou arraste para enviar</p>
                        <p className="text-xs text-slate-400 mt-1">Recomendado: 1280x720 (Horizontal)</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-2 font-medium bg-slate-100 px-2 py-1 rounded">JPG, PNG, WEBP (Máx 5MB)</p>
                    </div>
                )}
                
                <Input 
                    type="file" 
                    name="bannerUrl" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageChange} 
                />
            </div>
        </div>

        {/* BOTÃO SALVAR */}
        <div className="fixed bottom-6 right-6 z-50 md:static md:bottom-auto md:right-auto md:pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 font-bold text-white h-12 px-8 shadow-xl shadow-green-200/50 rounded-xl transition-all hover:-translate-y-1">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                {event?.id ? "Salvar Alterações" : "Agendar Evento"}
            </Button>
        </div>
    </form>
  )
}