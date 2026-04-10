"use client"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FeedbackModal } from "@/components/admin/shared/FeedbackModal"
import { useFeedback } from "@/hooks/useFeedback"
import { createStructure, updateStructure } from "@/server/actions/structure"
import { Save, Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface StructureData {
  id?: string
  title?: string
  description?: string | null
  content?: string | null
  chartImage?: string | null
  order?: number
}

interface StructureFormProps {
  structure?: StructureData | null
}

export function StructureForm({ structure }: StructureFormProps) {
  const router = useRouter()
  const { feedback, showSuccess, showError, close } = useFeedback()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(structure?.chartImage || null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      showError("Imagem Muito Grande", `Sua imagem tem ${(file.size / 1024 / 1024).toFixed(1)}MB, mas o limite é 10MB. Compacte ou redimensione antes de enviar.`)
      e.target.value = ""; return
    }
    if (!file.type.startsWith("image/")) { showError("Erro", "Formato inválido"); e.target.value = ""; return }
    setPreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setPreview(null)
    const input = formRef.current?.querySelector('input[name="chartImage"]') as HTMLInputElement
    if (input) input.value = ""
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      let result
      if (structure?.id) {
        formData.append("id", structure.id)
        if (structure.chartImage && !preview) {
          formData.append("removeImage", "true")
        } else if (!formData.get("chartImage") || (formData.get("chartImage") as File).size === 0) {
          if (structure.chartImage) formData.append("existingChartImage", structure.chartImage)
        }
        result = await updateStructure(formData)
      } else {
        result = await createStructure(formData)
      }

      if (!result.success) {
        showError("Erro", result.message)
      } else {
        showSuccess("Salvo!", result.message)
        router.push("/admin/institution/structure")
        router.refresh()
      }
    } catch {
      showError("Falha na Conexão", "Não foi possível completar a operação. Verifique sua conexão e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <FeedbackModal open={feedback.open} type={feedback.type} title={feedback.title} message={feedback.message} onClose={close} />
      <form ref={formRef} action={handleSubmit} className="space-y-6 pb-20 max-w-3xl">

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input name="title" defaultValue={structure?.title} required placeholder="Ex: Organograma Geral" />
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input name="order" type="number" defaultValue={structure?.order ?? 0} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição Curta</Label>
            <Input name="description" defaultValue={structure?.description ?? ""} placeholder="Subtítulo ou breve descrição..." />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo / Texto Explicativo</Label>
            <Textarea
              name="content"
              defaultValue={structure?.content ?? ""}
              rows={6}
              placeholder="Descreva a estrutura hierárquica, cargos, divisões..."
              className="resize-y"
            />
          </div>
        </div>

        {/* IMAGEM DO ORGANOGRAMA */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <Label className="flex items-center gap-2"><ImageIcon size={16} className="text-slate-400" /> Imagem do Organograma (Opcional)</Label>

          <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden relative bg-slate-50 hover:border-blue-400 transition-colors group">
            {preview ? (
              <div className="relative w-full">
                <Image src={preview} alt="Organograma" width={1200} height={600} className="w-full h-auto object-contain max-h-[400px]" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md z-10"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-slate-400">
                <UploadCloud size={32} className="mb-2 text-blue-300" />
                <p className="text-sm font-medium">Clique para enviar a imagem do organograma</p>
                <p className="text-xs mt-1 text-slate-400">PNG, JPG, WEBP — Máx 10MB</p>
              </div>
            )}
            <input
              type="file"
              name="chartImage"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 font-bold text-white h-11 px-8 shadow-md">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
          {structure?.id ? "Salvar Alterações" : "Criar"}
        </Button>
      </form>
    </>
  )
}
