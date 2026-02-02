"use client"

import { updateTeamMember, createTeamMember } from "@/app/actions/team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef } from "react"
import { Save, Loader2, UploadCloud, User, X, Instagram, Mail } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// --- LISTA DE CATEGORIAS (DEFINIDA AQUI PARA EVITAR ERRO DE IMPORT) ---
const TEAM_CATEGORIES = [
  "Diretoria Executiva",
  "Diretoria Administrativa",
  "Conselho Fiscal",
  "Coordenação",
  "Instrutores",
  "As Poderosas",
  "Voluntários",
  "Outros"
] as const;

interface MemberFormProps {
  member?: any
}

export function MemberForm({ member }: MemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(member?.image || null)
  const formRef = useRef<HTMLFormElement>(null)

  // Validação de Imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
         toast.error("Formato inválido!", { description: "Use JPG, PNG ou WEBP." });
         e.target.value = "";
         return;
      }
      if (file.size > 10 * 1024 * 1024) { 
         toast.warning("Arquivo muito pesado!", { description: "Máximo 10MB." });
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
        if (member?.id) {
            formData.append("id", member.id)
            if (!formData.get("image") || (formData.get("image") as File).size === 0) {
                if (member.image) formData.append("existingImage", member.image);
            }
            result = await updateTeamMember(formData)
        } else {
            result = await createTeamMember(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(member?.id ? "Membro atualizado!" : "Membro adicionado!")
            router.push("/admin/institution/team")
            router.refresh()
        }
    } catch (error) {
        toast.error("Erro inesperado.")
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
            
            {/* COLUNA ESQUERDA: DADOS */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nome Completo *</Label>
                            <Input name="name" defaultValue={member?.name} required placeholder="Ex: Cap. João Silva" />
                        </div>
                        <div className="space-y-2">
                            <Label>Cargo / Função *</Label>
                            <Input name="role" defaultValue={member?.role} required placeholder="Ex: Diretor Administrativo" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            
                            {/* SELECT AUTOMATIZADO */}
                            <Select name="category" defaultValue={member?.category}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEAM_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        </div>
                         <div className="space-y-2">
                            <Label>Ordem de Exibição</Label>
                            <Input name="order" type="number" defaultValue={member?.order || 0} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Biografia Curta</Label>
                        <Textarea name="bio" defaultValue={member?.bio} rows={3} placeholder="Breve descrição sobre o membro..." className="resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Instagram size={14}/> Instagram (Opcional)</Label>
                            <Input name="instagram" defaultValue={member?.instagram} placeholder="@usuario" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Mail size={14}/> Email (Opcional)</Label>
                            <Input name="email" defaultValue={member?.email} placeholder="contato@email.com" />
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUNA DIREITA: FOTO */}
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <Label>Foto do Membro</Label>
                    
                    <div className="relative w-full aspect-[3/4] bg-slate-50 rounded-lg overflow-hidden border-2 border-dashed border-slate-200 hover:border-blue-400 group cursor-pointer transition-colors">
                        
                        {preview ? (
                            <>
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white pointer-events-none">
                                    <UploadCloud size={24} className="mb-1"/> <span className="text-xs font-bold">Trocar</span>
                                </div>
                                <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md z-30 hover:scale-110 transition-transform"><X size={12}/></button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center pointer-events-none">
                                <User size={32} className="text-slate-300 mb-2" />
                                <span className="text-xs font-bold text-slate-500">Enviar Foto</span>
                            </div>
                        )}

                        <input 
                            type="file" 
                            name="image" 
                            accept="image/png, image/jpeg, image/webp" 
                            onChange={handleImageChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                        />
                    </div>
                    <p className="text-[10px] text-center text-slate-400">Recomendado: 3x4 (Vertical)</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-white h-12 shadow-md">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    Salvar
                </Button>
            </div>
        </div>
    </form>
  )
}