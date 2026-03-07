"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { contactMessageSchema } from "@/lib/validations" // Certifique-se que esse arquivo validations existe, senão remova essa linha e a validação

export async function sendContactMessage(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  }

  // Se você não tiver o arquivo de validação, pode remover este bloco IF
  /* const validation = contactMessageSchema.safeParse(data)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
  */

  try {
    // Verifica se a tabela existe no seu schema.prisma, senão vai dar erro
    // Se não tiver tabela, apenas simule o envio:
    // console.log("Mensagem recebida:", data);
    
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