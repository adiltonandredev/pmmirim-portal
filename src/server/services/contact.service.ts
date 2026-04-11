import { createContactMessageRecord } from "@/server/repositories/contact.repository"

export async function sendContactMessageService(formData: FormData) {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  const subject = (formData.get("subject") as string)?.trim()
  const message = (formData.get("message") as string)?.trim()

  if (!name || !email || !message) return { success: false, message: "Nome, e-mail e mensagem são campos obrigatórios." }

  if (name.length > 100) return { success: false, message: "Nome muito longo (máximo 100 caracteres)." }
  if (email.length > 254) return { success: false, message: "E-mail inválido." }
  if (subject && subject.length > 200) return { success: false, message: "Assunto muito longo (máximo 200 caracteres)." }
  if (message.length > 5000) return { success: false, message: "Mensagem muito longa (máximo 5000 caracteres)." }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return { success: false, message: "Por favor, insira um endereço de e-mail válido." }

  try {
    await createContactMessageRecord({ name, email, subject: subject || "Sem assunto", message })
    return { success: true, message: "Mensagem enviada com sucesso! Entraremos em contato em breve." }
  } catch {
    return { success: false, message: "Erro ao enviar mensagem. Tente novamente." }
  }
}
