"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createCourse, updateCourse } from "@/app/actions/courses"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { BookOpen, Clock, Users, FileText, UploadCloud, X, Image as ImageIcon, Handshake, Loader2, Save, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
// Importamos o tipo do Prisma
import { Course } from "@prisma/client"

export function CourseForm({ course }: { course?: Course | null }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  
  // States
  const [coverPreview, setCoverPreview] = useState<string | null>(course?.coverImage || null)
  const [sponsorPreview, setSponsorPreview] = useState<string | null>(course?.sponsorLogo || null)
  const [contentHtml, setContentHtml] = useState<string>(course?.content || "")   
  const [isPending, setIsPending] = useState(false)

  // === FUNÇÃO DE VALIDAÇÃO DE IMAGEM MELHORADA ===
  function handleImageChange(e: ChangeEvent<HTMLInputElement>, setPreview: (url: string | null) => void) {
    const file = e.target.files?.[0];
    
    if (file) {
      // 1. Validação de Formato (MIME Type)
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Formato inválido!", { 
            description: "Apenas imagens JPG, PNG ou WEBP são permitidas.",
            icon: <AlertTriangle className="text-red-500" />
        });
        e.target.value = ""; // Limpa o input para o usuário tentar de novo
        return;
      }

      // 2. Validação de Tamanho (Máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("Arquivo muito pesado!", { 
            description: "O tamanho máximo permitido é 5MB." 
        });
        e.target.value = ""; // Limpa o input
        return;
      }

      // Se passou, gera o preview
      setPreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage(name: string, setPreview: (url: null) => void) {
    setPreview(null);
    if (formRef.current) {
        const input = formRef.current.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (input) input.value = "";
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    
    // Adiciona o HTML do editor ao FormData
    formData.set("content", contentHtml)

    const action = course ? updateCourse : createCourse
    
    if (course) {
        formData.append("id", course.id)
        
        // Mantém imagens antigas se não enviou novas
        if (!formData.get("coverImage") || (formData.get("coverImage") as File).size === 0) {
            if (course.coverImage) formData.append("existingCoverImage", course.coverImage);
        }
        if (!formData.get("sponsorLogo") || (formData.get("sponsorLogo") as File).size === 0) {
            if (course.sponsorLogo) formData.append("existingSponsorLogo", course.sponsorLogo);
        }
    }

    const res = await action(formData)
    
    if (res?.error) {
      toast.error(res.error)
      setIsPending(false)
    } else {
      toast.success(course ? "Curso atualizado com sucesso!" : "Curso criado com sucesso!")
      router.refresh()
      router.push("/admin/courses")
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 pb-20">
        
        {/* === COLUNA ESQUERDA: DADOS === */}
        <div className="space-y-6">
            
            {/* CARD: INFORMAÇÕES BÁSICAS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                    <BookOpen className="text-blue-600" size={20} />
                    <h3 className="font-bold text-slate-800">Dados do Curso</h3>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500">Nome do Curso *</Label>
                    <Input required name="title" defaultValue={course?.title || ""} placeholder="Ex: Informática Básica" className="font-bold text-lg h-12" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase"><Clock size={14}/> Carga Horária</Label>
                        <Input name="duration" defaultValue={course?.duration || ""} placeholder="Ex: 60 Horas" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase"><Users size={14}/> Público Alvo</Label>
                        <Input name="targetAge" defaultValue={course?.targetAge || ""} placeholder="Ex: 14 a 17 anos" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="uppercase text-xs font-bold text-slate-500">Descrição Curta *</Label>
                    <Textarea required name="description" rows={3} defaultValue={course?.description || ""} placeholder="Uma breve explicação que aparece no card..." className="resize-none" />
                </div>
            </div>

            {/* CARD: EDITOR RICO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                    <FileText className="text-blue-600" size={20} />
                    <h3 className="font-bold text-slate-800">Ementa Detalhada</h3>
                </div>
                
                <RichTextEditor content={contentHtml} onChange={setContentHtml} />
                <p className="text-xs text-slate-400">Use a barra de ferramentas para formatar o texto, adicionar listas ou links.</p>
            </div>

            {/* CARD: PATROCÍNIO (Com Upload de Logo) */}
            <div className="bg-yellow-50/50 p-6 rounded-xl border border-yellow-200 space-y-4">
                <h3 className="font-bold text-yellow-800 flex items-center gap-2 border-b border-yellow-100 pb-2">
                    <Handshake size={20} /> Patrocínio (Opcional)
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 w-full space-y-2">
                        <Label className="text-yellow-700">Nome da Empresa</Label>
                        <Input name="sponsorName" defaultValue={course?.sponsorName || ""} placeholder="Ex: Cresol Amazonas" className="bg-white border-yellow-300 focus-visible:ring-yellow-500" />
                    </div>
                    <div className="w-full md:w-auto space-y-2">
                         <Label className="text-yellow-700 block text-center md:text-left">Logo da Empresa</Label>
                         <div className="relative w-32 h-32 bg-white rounded-lg border-2 border-dashed border-yellow-300 hover:border-yellow-500 cursor-pointer overflow-hidden group mx-auto md:mx-0">
                            {sponsorPreview ? (
                                <Image src={sponsorPreview} alt="Logo" fill className="object-contain p-2" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-yellow-300"><UploadCloud size={24} /></div>
                            )}
                            {/* Input com Accept para filtrar no sistema operacional */}
                            <input 
                                type="file" 
                                name="sponsorLogo" 
                                accept="image/png, image/jpeg, image/webp" 
                                onChange={(e) => handleImageChange(e, setSponsorPreview)} 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                            {sponsorPreview && <button type="button" onClick={() => handleRemoveImage('sponsorLogo', setSponsorPreview)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded shadow-sm z-10"><X size={12} /></button>}
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* === COLUNA DIREITA: STATUS E CAPA === */}
        <div className="space-y-6">
            
            {/* CARD: STATUS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base font-bold text-slate-800">Curso Ativo?</Label>
                    <p className="text-xs text-slate-500">Exibir no site público.</p>
                </div>
                <Switch name="active" defaultChecked={course?.active ?? true} />
            </div>

            {/* CARD: CAPA DO CURSO (Com Upload) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon size={18} className="text-blue-600" /> Capa do Curso
                </Label>
                
                <div className="relative group w-full aspect-video bg-slate-50 rounded-lg overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors">
                    {coverPreview ? (
                        <>
                            <Image src={coverPreview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer pointer-events-none">
                                <UploadCloud size={32} className="mb-1"/> <span className="text-sm font-bold">Trocar Foto</span>
                            </div>
                            <button type="button" onClick={() => handleRemoveImage('coverImage', setCoverPreview)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10"><X size={14} /></button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center">
                            <ImageIcon size={32} className="text-slate-300 mb-2" />
                            <span className="text-xs font-bold text-slate-500">Arraste ou Clique</span>
                            <span className="text-[10px] text-slate-400 mt-1">JPG/PNG (Máx 5MB)</span>
                        </div>
                    )}
                    {/* Input com Accept para filtrar no sistema operacional */}
                    <input 
                        type="file" 
                        name="coverImage" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={(e) => handleImageChange(e, setCoverPreview)} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                </div>                
            </div>

            {/* BOTÃO SALVAR */}
            <div className="sticky bottom-4 z-10">
                <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14 text-lg shadow-xl shadow-green-100 rounded-xl transition-all hover:-translate-y-1">
                  {isPending ? (
                      <><Loader2 className="animate-spin mr-2" /> Salvando...</>
                  ) : (
                      <><Save className="mr-2" /> {course ? "Salvar Alterações" : "Cadastrar Curso"}</>
                  )}
                </Button>
            </div>
        </div>
      </form>
  )
}