"use client"

import { deletePost } from "@/app/actions/posts"
import { useState } from "react"

export function DeletePostButton({ postId }: { postId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return
    setIsLoading(true)
    await deletePost(postId)
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isLoading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isLoading ? "..." : "Excluir"}
    </button>
  )
}