"use client"

import { useState } from "react"
import { createComment } from "@/actions/comments" // <-- Verifique se o caminho da sua action está correto
import { MessageCircle } from "lucide-react"

export function CommentForm({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // 👇 SALVAMOS O FORMULÁRIO AQUI ANTES DO AWAIT
    const form = e.currentTarget;

    setLoading(true)
    setMessage(null)

    const formData = new FormData(form)
    formData.append("postId", postId)

    // Chama a nossa Action
    const result = await createComment(formData)

    if (result.success) {
      setMessage({ type: "success", text: result.message })
      form.reset() // 👇 USAMOS A VARIÁVEL SALVA AQUI!
    } else {
      setMessage({ type: "error", text: result.message || "Ocorreu um erro ao comentar." })
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-12">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <MessageCircle className="text-red-500" />
        Deixe seu Comentário
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
          <input
            id="author"
            name="author"
            required
            placeholder="Como quer ser chamado?"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Comentário</label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            placeholder="O que você achou desta notícia?"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-y"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg font-medium text-sm transition-all duration-300 ${message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Publicar Comentário"}
        </button>
      </form>
    </div>
  )
}