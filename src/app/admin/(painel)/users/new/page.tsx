"use client"

import { createUser } from "@/server/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageContainer, PageHeader, PageTitle, PageContent } from "@/components/admin/shared/PageLayout"
import { Loader2, Save, UserPlus, Lock, Mail, User, AlertCircle } from "lucide-react"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
            subtitle="Adicione um novo administrador ou editor ao sistema." 
            icon={UserPlus} 
            backLink="/admin/users" 
        />
      </PageHeader>

      <PageContent>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            
            <div className="space-y-2">
                <Label className="flex items-center gap-2"><User size={16} /> Nome Completo</Label>
                <Input name="name" placeholder="Ex: Sargento Silva" required className="h-12" />
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail size={16} /> E-mail de Acesso</Label>
                <Input name="email" type="email" placeholder="email@pmm.com.br" required className="h-12" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Lock size={16} /> Senha Inicial</Label>
                    <Input name="password" type="password" placeholder="******" required className="h-12" />
                </div>
                <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Lock size={16} /> Confirmar Senha</Label>
                    <Input name="confirmPassword" type="password" placeholder="Repita a senha" required className="h-12" />
                </div>
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

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="font-bold">{error}</span>
                </div>
            )}

            <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-base">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={20} />}
                    Salvar Usuário
                </Button>
            </div>

        </form>
      </PageContent>
    </PageContainer>
  )
}