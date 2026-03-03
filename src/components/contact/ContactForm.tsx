"use client"

import { useState } from "react"
import { sendContactMessage } from "@/app/actions/contact"
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
    const result = await sendContactMessage(formData)

    if (result.success) {
      setMessage({ type: "success", text: result.success })
      e.currentTarget.reset()
    } else if (result.error) {
      setMessage({ type: "error", text: result.error })
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
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? "Enviando..." : "Enviar Mensagem"}
      </Button>
    </form>
  )
}
