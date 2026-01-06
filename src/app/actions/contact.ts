"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { contactMessageSchema } from "@/lib/validations"

export async function sendContactMessage(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  }

  const validation = contactMessageSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      },
    })

    revalidatePath("/contato")
    return { success: "Mensagem enviada com sucesso! Entraremos em contato em breve." }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao enviar mensagem. Tente novamente." }
  }
}
