"use client"

import { useState } from "react"
import { updateUser } from "@/server/actions/users" // ⚠️ Ajuste o caminho se a sua action não estiver aqui
import { toast } from "sonner" // 🌟 Nosso balãozinho elegante!
import { useRouter } from "next/navigation"

// Definimos o tipo de dado que esperamos receber
type UserProps = {
  id: string
  name: string | null
  email: string | null
  role: string
}

export function EditUserModal({ user }: { user: UserProps }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(event.currentTarget)
      formData.append("id", user.id)

      const result = await updateUser(formData)

      // Nosso Molde Sênior entra aqui
      if (!result.success) {
        toast.error(result.message || "Erro ao atualizar usuário.")
      } else {
        toast.success(result.message || "Usuário atualizado com sucesso!")
        setIsOpen(false) // Fecha o modal só se deu certo
        router.refresh() // Atualiza a tabela que fica por trás do modal!
      }
    } catch (error) {
      console.error("Erro no modal de usuário:", error)
      toast.error("Ocorreu um erro inesperado ao salvar.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900 font-medium mr-4"
      >
        Editar
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-xl">
              <h3 className="font-bold text-lg text-slate-800">Editar Usuário</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-red-500 text-2xl leading-none transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                <input 
                  name="name" 
                  defaultValue={user.name || ""} 
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                <input 
                  name="email" 
                  type="email"
                  required
                  defaultValue={user.email || ""} 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              {/* Senha (Opcional) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Nova Senha</span>
                  <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                </label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Deixe em branco para manter a atual" 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              {/* Confirmar Senha (A nossa action nova exige isso agora!) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Confirmar Nova Senha</span>
                  <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                </label>
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Repita a nova senha" 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nível de Acesso</label>
                <select 
                  name="role" 
                  defaultValue={user.role} 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="EDITOR">Editor — Gerencia conteúdo</option>
                  <option value="ADMIN">Administrador — Acesso total</option>
                  <option value="VIEWER">Visualizador — Somente leitura</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Salvando...
                    </>
                  ) : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}