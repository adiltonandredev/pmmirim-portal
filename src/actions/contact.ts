"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- CREATE ---
export async function sendContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validação manual simples e segura
    if (!name || !email || !message) {
      return { success: false, message: "Nome, e-mail e mensagem são campos obrigatórios." }
    }

    // Validação básica de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, message: "Por favor, insira um endereço de e-mail válido." }
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || "Sem assunto",
        message,
      },
    })

    // Atualiza a página de contato (caso tenha algum contador) e o painel admin
    revalidatePath("/contato")
    revalidatePath("/admin/mensagens") // Atualiza a caixa de entrada do painel!
    
    return { success: true, message: "Mensagem enviada com sucesso! Entraremos em contato em breve." }

  } catch (error) {
    console.error("Erro ao enviar mensagem de contato:", error)
    return { success: false, message: "Erro interno ao enviar a mensagem. Tente novamente mais tarde." }
  }
}