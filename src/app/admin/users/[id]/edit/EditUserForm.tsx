"use client"

import { updateUser } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Lock, Mail, User, AlertCircle } from "lucide-react"

export function EditUserForm({ user }: { user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateUser(formData)
    
    if (result?.error) {
        setError(result.error)
        setLoading(false)
    } else {
        router.push("/admin/users")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <input type="hidden" name="id" value={user.id} />

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><User size={16} /> Nome</Label>
                <Input name="name" defaultValue={user.name} required />
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail size={16} /> E-mail</Label>
                <Input name="email" type="email" defaultValue={user.email} required />
            </div>

            <div className="space-y-2">
                <Label>Nível de Acesso</Label>
                <Select name="role" defaultValue={user.role || "USER"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">Usuário</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm space-y-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Lock size={16} /> Redefinir Senha
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-blue-800 uppercase">Nova Senha</Label>
                    <Input name="password" type="password" className="bg-white" />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-blue-800 uppercase">Confirmar Senha</Label>
                    <Input name="confirmPassword" type="password" className="bg-white" />
                </div>
            </div>
            <p className="text-xs text-blue-600/70 italic">* Deixe em branco para manter a senha atual.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 border border-red-200 text-sm font-bold animate-in slide-in-from-top-1">
                <AlertCircle size={18} /> {error}
            </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} className="mr-2" />} Salvar
        </Button>
    </form>
  )
}