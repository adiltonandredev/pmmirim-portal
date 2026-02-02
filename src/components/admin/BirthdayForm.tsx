"use client"

import { updateBirthday, createBirthday } from "@/app/actions/birthdays"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState, useRef } from "react"
import { Save, Loader2, UploadCloud, User, X, Cake, CalendarIcon, Briefcase } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BirthdayFormProps {
  birthday?: any
}

export function BirthdayForm({ birthday }: BirthdayFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(birthday?.photoUrl || null)
  const formRef = useRef<HTMLFormElement>(null)

  // Ajusta a data para o input date (YYYY-MM-DD)
  const defaultDate = birthday?.date 
    ? new Date(birthday.date).toISOString().split('T')[0] 
    : ""

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
      // Validação visual de 10MB (o servidor aguenta 50MB, mas bom avisar)
      if (file.size > 10 * 1024 * 1024) { 
         toast.warning("Arquivo muito pesado!", { description: "Recomendado até 10MB." });
         e.target.value = "";
         return;
      }
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
      setPreview(null)
      if (formRef.current) {
          const input = formRef.current.querySelector('input[name="photoUrl"]') as HTMLInputElement;
          if (input) input.value = "";
      }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
        let result;
        if (birthday?.id) {
            formData.append("id", birthday.id)
            if (!formData.get("photoUrl") || (formData.get("photoUrl") as File).size === 0) {
                if (birthday.photoUrl) formData.append("existingPhotoUrl", birthday.photoUrl);
            }
            result = await updateBirthday(formData)
        } else {
            result = await createBirthday(formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(birthday?.id ? "Atualizado com sucesso!" : "Cadastrado com sucesso!")
            router.push("/admin/birthdays")
            router.refresh()
        }
    } catch (error) {
        toast.error("Erro inesperado.")
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            
            {/* DADOS */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 h-fit">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <Cake className="text-pink-500" size={20} />
                        Dados Pessoais
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                         <Label htmlFor="active" className="text-xs font-bold text-slate-500 cursor-pointer">Exibir?</Label>
                         <Switch name="active" id="active" defaultChecked={birthday?.active ?? true} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input name="name" defaultValue={birthday?.name} required placeholder="Ex: Sd. Maria Oliveira" className="h-12 text-lg font-bold text-slate-700" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500"><CalendarIcon size={14}/> Nascimento *</Label>
                        <Input type="date" name="date" defaultValue={defaultDate} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs uppercase font-bold text-slate-500"><Briefcase size={14}/> Turma / Cargo</Label>
                        <Input name="role" defaultValue={birthday?.role} placeholder="Ex: Instrutor" className="h-11" />
                    </div>
                </div>
            </div>

            {/* FOTO */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit flex flex-col items-center">
                <Label className="font-bold text-slate-700 w-full text-left">Foto (Opcional)</Label>
                
                {/* ÁREA CLICÁVEL CORRIGIDA */}
                <div className="relative w-48 h-48 aspect-square bg-slate-50 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner group hover:border-pink-300 transition-colors cursor-pointer">
                    {preview ? (
                        <>
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white pointer-events-none">
                                <UploadCloud size={32} className="mb-1"/> <span className="text-xs font-bold">Trocar</span>
                            </div>
                            <button type="button" onClick={handleRemoveImage} className="absolute top-4 right-4 bg-red-500 text-white p-1.5 rounded-full shadow-md z-30 hover:scale-110 transition-transform"><X size={16}/></button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center pointer-events-none">
                            <User size={48} className="text-slate-300 mb-2" />
                            <span className="text-xs font-bold text-slate-500">Adicionar Foto</span>
                        </div>
                    )}

                    {/* INPUT CORRIGIDO: Cobre 100% da área com z-20 */}
                    <input 
                        type="file" 
                        name="photoUrl" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={handleImageChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                    />
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">Clique no círculo para enviar.<br/>Recomendado: Rosto centralizado.</p>

                <Button type="submit" disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 font-bold text-white h-12 shadow-md mt-2 rounded-xl">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                    Salvar Dados
                </Button>
            </div>
        </div>
    </form>
  )
}