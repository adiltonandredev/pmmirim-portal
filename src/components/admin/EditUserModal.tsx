// src/components/EditUserModal.tsx
"use client"

import { useState } from "react"
import { updateUser } from "@/app/actions/updateUser"

// Definimos o tipo de dado que esperamos receber
type UserProps = {
  id: string
  name: string | null
  email: string | null
  role: string
}

export function EditUserModal({ user }: { user: UserProps }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    // Precisamos anexar o ID para o servidor saber quem atualizar
    formData.append("id", user.id)

    const result = await updateUser(formData)

    if (result.error) {
      alert(result.error)
    } else {
      alert(result.success)
      setIsOpen(false)
    }
    setIsLoading(false)
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Editar Usuário</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  name="name" 
                  defaultValue={user.name || ""} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  name="email" 
                  defaultValue={user.email || ""} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>

              {/* Senha (Opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (Opcional)</label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Deixe em branco para manter a atual" 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select 
                  name="role" 
                  defaultValue={user.role} 
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="EDITOR">EDITOR</option>
                  <option value="ADMIN">ADMIN</option>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}