// src/components/DeleteUserButton.tsx
"use client"

import { deleteUser } from "@/app/actions/users"
import { useState } from "react"

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    // A Confirmação do Navegador
    const confirmed = window.confirm("Tem certeza que deseja excluir este usuário? Essa ação não tem volta.")
    
    if (!confirmed) return

    setIsLoading(true)
    
    // Chama a Server Action que criamos no Passo 1
    const result = await deleteUser(userId)

    if (result?.error) {
      alert(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Excluindo..." : "Excluir"}
    </button>
  )
}