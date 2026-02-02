"use client"

import { Button } from "@/components/ui/button"
import { useState, ChangeEvent } from "react"
import { Save, User, Briefcase, Camera, Mail, Phone, AlignLeft, X, BadgeCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Interface dos dados
interface BoardMemberData {
  id: string
  name: string
  position: string
  photoUrl?: string | null
  order?: number | null
  email?: string | null
  phone?: string | null
  bio?: string | null
  active: boolean
}

interface BoardMemberFormProps {
  data: BoardMemberData
  action: (formData: FormData) => void
}

export function BoardMemberForm({ data, action }: BoardMemberFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.photoUrl || null)
  const [isPending, setIsPending] = useState(false)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  function handleRemoveImage() {
    setPhotoPreview(null)
  }

  return (
    <form action={action} onSubmit={() => setIsPending(true)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <input type="hidden" name="existingPhotoUrl" value={data.photoUrl || ""} />
        {!photoPreview && data.photoUrl && <input type="hidden" name="removePhoto" value="true" />}

        {/* COLUNA FOTO */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-4 uppercase text-center">Foto de Perfil</label>
                <div className="relative w-full aspect-square bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors overflow-hidden group cursor-pointer">
                    {photoPreview ? (
                        <>
                            <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <Camera size={32} className="mb-2" />
                                <span className="text-sm font-bold">Trocar Foto</span>
                            </div>
                            <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md z-10 hover:bg-red-600">
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-4 text-center pointer-events-none">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                                <User size={40} className="text-slate-300" />
                            </div>
                            <span className="text-sm font-medium text-slate-500">Clique para enviar foto</span>
                        </div>
                    )}
                    <input type="file" name="photo" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <div className="flex items-center gap-3">
                    <input type="checkbox" name="active" id="active" defaultChecked={data.active} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <div>
                        <label htmlFor="active" className="block text-sm font-bold text-blue-900 cursor-pointer">Membro Ativo</label>
                        <p className="text-xs text-blue-600">Exibir este membro no site público.</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* COLUNA DADOS */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BadgeCheck className="text-blue-600" size={20}/> Informações Pessoais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><User size={14}/> Nome Completo *</label>
                        <input required name="name" defaultValue={data.name} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><Briefcase size={14}/> Cargo *</label>
                        <input required name="position" defaultValue={data.position} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><AlignLeft size={14}/> Ordem</label>
                         <input type="number" name="order" defaultValue={data.order || 1} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><Mail size={14}/> Email</label>
                        <input type="email" name="email" defaultValue={data.email || ""} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1"><Phone size={14}/> Telefone</label>
                        <input name="phone" defaultValue={data.phone || ""} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Minibiografia</label>
                    <textarea name="bio" defaultValue={data.bio || ""} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <Link href="/admin/diretoria">
                        <Button variant="outline" type="button" className="h-12 px-6">Cancelar</Button>
                    </Link>
                    <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 shadow-lg">
                        <Save className="mr-2" size={20} /> {isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>
        </div>
    </form>
  )
}