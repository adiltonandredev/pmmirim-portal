"use client"

import { useState } from "react"
import { sendContactMessage } from "@/actions/contact" // Se der erro no import, troque para o caminho correto onde está a action
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    // Chama a nossa Action blindada
    const result = await sendContactMessage(formData)

    // O retorno agora é sempre um objeto com { success: true/false, message: "Texto..." }
    if (result.success) {
      setMessage({ type: "success", text: result.message })
      e.currentTarget.reset() // Limpa o formulário após o sucesso
    } else {
      setMessage({ type: "error", text: result.message || "Ocorreu um erro ao enviar." })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Seu nome completo"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="subject">Assunto</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Assunto da mensagem"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Digite sua mensagem..."
          rows={6}
          className="mt-1"
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg font-medium text-sm transition-all duration-300 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        {loading ? "Enviando Mensagem..." : "Enviar Mensagem"}
      </Button>
    </form>
  )
}