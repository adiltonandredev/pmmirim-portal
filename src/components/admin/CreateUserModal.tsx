// src/components/admin/CreateUserModal.tsx
"use client"

import { useState } from "react"
import { createUser } from "@/app/actions/createUser"

export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await createUser(formData)

    if (result.error) {
      alert(result.error)
    } else {
      alert(result.success)
      setIsOpen(false) // Fecha o modal
    }

    setIsLoading(false)
  }

  return (
    <>
      {/* Botão que abre o modal */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        + Adicionar Novo
      </button>

      {/* O Modal (Só aparece se isOpen for true) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Novo Usuário</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 text-xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input name="name" type="text" required className="w-full border rounded px-3 py-2" placeholder="Ex: João Silva" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="joao@exemplo.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input name="password" type="password" required className="w-full border rounded px-3 py-2" placeholder="******" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select name="role" className="w-full border rounded px-3 py-2 bg-white">
                  <option value="EDITOR">EDITOR (Padrão)</option>
                  <option value="ADMIN">ADMIN (Acesso Total)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Salvando..." : "Criar Usuário"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}