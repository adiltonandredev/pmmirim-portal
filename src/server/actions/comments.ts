"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- CREATE ---
export async function createComment(formData: FormData) {
  try {
    const author = formData.get("author") as string
    const content = formData.get("content") as string
    const postId = formData.get("postId") as string

    if (!author || !content || !postId) {
      return { success: false, message: "Preencha todos os campos obrigatórios." }
    }

    await prisma.comment.create({
      data: {
        author,
        content,
        postId
      }
    })

    // Atualiza as páginas públicas para mostrar o novo comentário na hora
    revalidatePath(`/noticias/[slug]`, 'page') 
    revalidatePath(`/projetos/[slug]`, 'page') // Adicionei para garantir caso projetos também tenham comentários
    
    return { success: true, message: "Comentário enviado com sucesso!" }

  } catch (error) {
    console.error("Erro ao enviar comentário:", error)
    return { success: false, message: "Erro interno ao enviar o comentário." }
  }
}