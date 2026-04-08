"use client"

import { createUser } from "@/server/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Loader2, Save, UserPlus, Lock, Mail, User, AlertCircle, Camera, Trash2 } from "lucide-react"
import Image from "next/image"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo 5MB.")
      return
    }
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData(e.currentTarget)
      const result = await createUser(formData)
      if (!result.success) {
        setError(result.message || "Erro ao criar usuário")
      } else {
        router.push("/admin/users")
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || "Erro inesperado ao criar usuário.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle
          title="Novo Usuário"
          subtitle="Adicione um novo membro à equipe administrativa."
          icon={UserPlus}
          backLink="/admin/users"
        />
      </PageHeader>

      <PageContent>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">

          {/* Avatar */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide self-start">
              Foto do Usuário <span className="font-normal text-slate-400 normal-case">(opcional)</span>
            </p>
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-200 bg-slate-100 flex items-center justify-center">
                {preview ? (
                  <Image src={preview} alt="Avatar" fill className="object-cover rounded-full" />
                ) : (
                  <User size={44} className="text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 transition-colors border-2 border-white"
              >
                <Camera size={16} />
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-bold text-blue-700 hover:underline">
                {preview ? "Trocar foto" : "Adicionar foto"}
              </button>
              {preview && (
                <>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={handleRemoveImage} className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1">
                    <Trash2 size={11} /> Remover
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Dados principais */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User size={16} /> Nome Completo</Label>
              <Input name="name" placeholder="Ex: Sargento Silva" required className="h-12" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail size={16} /> E-mail de Acesso</Label>
              <Input name="email" type="email" placeholder="email@pmm.com.br" required className="h-12" />
            </div>

            <div className="space-y-2">
              <Label>Nível de Acesso</Label>
              <Select name="role" defaultValue="EDITOR">
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor — Gerencia conteúdo</SelectItem>
                  <SelectItem value="ADMIN">Administrador — Acesso total</SelectItem>
                  <SelectItem value="VIEWER">Visualizador — Somente leitura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Senha */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Lock size={16} /> Senha de Acesso
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Lock size={16} /> Senha Inicial</Label>
                <Input name="password" type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" required className="h-12 bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Lock size={16} /> Confirmar Senha</Label>
                <Input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repita a senha" required className="h-12 bg-white" />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
              <AlertCircle size={20} />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-base">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
            Criar Usuário
          </Button>

        </form>
      </PageContent>
    </PageContainer>
  )
}
