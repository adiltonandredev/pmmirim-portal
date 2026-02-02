"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createComment(formData: FormData) {
  const author = formData.get("author") as string
  const content = formData.get("content") as string
  const postId = formData.get("postId") as string

  if (!author || !content || !postId) {
    return { error: "Preencha todos os campos." }
  }

  try {
    await prisma.comment.create({
      data: {
        author,
        content,
        postId
      }
    })

    // Atualiza a página da notícia para mostrar o novo comentário
    revalidatePath(`/noticias/[slug]`, 'page') 
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Erro ao enviar comentário." }
  }
}