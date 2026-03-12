import { createContactMessageRecord } from "@/server/repositories/contact.repository"

export async function sendContactMessageService(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string
  if (!name || !email || !message) return { success: false, message: "Nome, e-mail e mensagem são campos obrigatórios." }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return { success: false, message: "Por favor, insira um endereço de e-mail válido." }
  await createContactMessageRecord({ name, email, subject: subject || "Sem assunto", message })
  return { success: true, message: "Mensagem enviada com sucesso! Entraremos em contato em breve." }
}
