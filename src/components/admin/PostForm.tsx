"use client"

import { updatePost, createPost } from "@/app/actions/posts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState, useRef } from "react"
import { Save, Loader2, UploadCloud, Star, Plus, AlertTriangle, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner" 
import { RichTextEditor } from "./RichTextEditor"

// 1. Definição da Interface para evitar o "any"
interface PostData {
  id?: string;
  title?: string;
  summary?: string | null;
  content?: string | null;
  coverImage?: string | null;
  published?: boolean;
  featured?: boolean;
  type?: string;
}

interface PostFormProps {
  post?: PostData | null // Aceita null também
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(post?.coverImage || null)
  const [content, setContent] = useState(post?.content || "")
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
         toast.error("Formato inválido!", { description: "Apenas JPG, PNG ou WEBP." });
         e.target.value = ""; 
         return;
      }
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
    formData.set("content", content)
    formData.set("type", "NEWS") 

    try {
        let result;
        if (post?.id) {
            formData.append("id", post.id);
            if (!formData.get("coverImage") || (formData.get("coverImage") as File).size === 0) {
                if (post.coverImage) formData.append("existingCoverImage", post.coverImage);
            }
            result = await updatePost(formData);
        } else {
            result = await createPost(formData);
        }

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success(post?.id ? "Notícia atualizada!" : "Notícia publicada!");
            router.push("/admin/posts");
            router.refresh();
        }
    } catch (error) {
        console.error("Erro ao salvar:", error)
        toast.error("Erro inesperado ao salvar.");
    }
    setLoading(false)
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20">
        <input type="hidden" name="type" value="NEWS" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-700">Status da Publicação</Label>
                    <p className="text-[10px] text-slate-500">Defina se já aparece no site</p>
                </div>
                <Switch name="published" defaultChecked={post?.published ?? true} />
            </div>

            <div className="flex items-center justify-between bg-yellow-50/50 p-4 rounded-xl border border-yellow-200 shadow-sm">
                <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-yellow-800 flex items-center gap-1">
                        <Star size={14} fill="currentColor" className="text-yellow-500" /> Destaque Principal
                    </Label>
                    <p className="text-[10px] text-yellow-600">Banner rotativo da Home</p>
                </div>
                <Switch name="featured" defaultChecked={post?.featured ?? false} className="data-[state=checked]:bg-yellow-500" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title" className="uppercase text-xs font-bold text-slate-500">Título da Notícia *</Label>
                <Input id="title" name="title" defaultValue={post?.title || ""} required className="font-bold text-lg h-12" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="summary" className="uppercase text-xs font-bold text-slate-500">Resumo (Lead)</Label>
                <Textarea id="summary" name="summary" defaultValue={post?.summary || ""} rows={2} className="resize-none" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <Label className="uppercase text-xs font-bold text-slate-500">Conteúdo Completo</Label>
            <div className="min-h-[300px]">
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <Label className="uppercase text-xs font-bold text-slate-500 flex items-center gap-2">Imagem de Capa</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors group relative bg-slate-50/50">
                {preview ? (
                    <div className="relative w-full aspect-video max-h-[400px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                        <Image src={preview} alt="Capa" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="bg-white/90 text-slate-700 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 font-bold shadow-sm flex items-center gap-2"><UploadCloud size={14}/> Alterar</span>
                        </div>
                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10"><X size={14} /></button>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3"><UploadCloud size={28} /></div>
                        <p className="text-sm text-slate-600 font-bold">Clique ou arraste para enviar</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-2 font-medium bg-slate-100 px-2 py-1 rounded">JPG, PNG, WEBP (Máx 20MB)</p>
                    </div>
                )}
                <Input type="file" name="coverImage" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
            </div>
        </div>

        <div className="fixed bottom-6 right-6 z-50 md:static md:bottom-auto md:right-auto md:pt-4">
            <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 font-bold text-white h-12 px-8 shadow-xl shadow-blue-200/50 rounded-xl transition-all hover:-translate-y-1">
                {loading ? <Loader2 className="animate-spin mr-2" /> : post?.id ? <Save className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                {post?.id ? "Salvar Alterações" : "Publicar Notícia"}
            </Button>
        </div>
    </form>
  )
}