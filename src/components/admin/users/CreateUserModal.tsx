"use client"

import { useState } from "react"
import { createUser } from "@/server/actions/users"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, X, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreateUserModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await createUser(formData) as any;

    if (result?.success === false) {
      toast.error(result.message || "Erro ao criar usuário")
    } else {
      toast.success(result.message || "Usuário criado com sucesso!")
      setIsOpen(false)
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <>
      {/* Botão que abre o modal */}
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
      >
        <UserPlus size={18} />
        <span className="hidden sm:inline">Adicionar Novo</span>
        <span className="sm:hidden">Novo</span>
      </Button>

      {/* O Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Cabeçalho */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Novo Usuário</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Nome Completo</label>
                <input 
                  name="name" 
                  type="text" 
                  required 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="Ex: João Silva" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">E-mail de Acesso</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="joao@exemplo.com" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Senha Provisória</label>
                <input 
                  name="password" 
                  type="password" 
                  required 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="******" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-slate-700">Nível de Acesso</label>
                <select 
                  name="role" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  <option value="EDITOR">EDITOR (Padrão)</option>
                  <option value="ADMIN">ADMIN (Acesso Total)</option>
                </select>
              </div>

              {/* Ações */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="font-bold text-slate-600"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin mr-2" size={18} /> Salvando...</>
                  ) : (
                    "Criar Usuário"
                  )}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}