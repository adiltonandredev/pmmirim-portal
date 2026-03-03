"use client"

import { deletePost } from "@/app/actions/posts"
import { useState } from "react"
import { Button } from "@/components/ui/button" 
import { Trash2, Loader2 } from "lucide-react"

export function DeletePostButton({ postId }: { postId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return
    
    setIsLoading(true)
    
    try {
      // CORREÇÃO PRINCIPAL: Criar o "envelope" FormData
      const formData = new FormData()
      formData.append("id", postId)
      
      // Agora enviamos o envelope, não apenas o texto
      await deletePost(formData)
    } catch (error) {
      console.error("Erro ao excluir", error)
      alert("Erro ao excluir notícia")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isLoading}
      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
      title="Excluir Notícia"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Trash2 size={16} />
      )}
    </Button>
  )
}