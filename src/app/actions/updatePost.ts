"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { uploadImage } from "@/lib/upload"

export async function updatePost(formData: FormData) {
  const session = await auth()
  
  // Verifica permissão
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return { error: "Não autorizado" }
  }

  // Pega os dados do formulário
  const postId = formData.get("id") as string
  const title = formData.get("title") as string
  const summary = formData.get("summary") as string
  const content = formData.get("content") as string
  const type = formData.get("type") as any
  const status = formData.get("status") as string
  const isFeatured = formData.get("isFeatured") === "true"
  const removeImage = formData.get("removeImage") === "true"
  
  const coverImageFile = formData.get("coverImage") as File

  // Lógica da imagem
  let coverImageUrl: string | null = null

  if (removeImage) {
    coverImageUrl = null
  } else if (coverImageFile && coverImageFile.size > 0) {
    try {
      const uploadedPath = await uploadImage(coverImageFile)
      if (uploadedPath) coverImageUrl = uploadedPath
    } catch (error: any) {
      return { error: error.message || "Erro ao fazer upload da imagem" }
    }
  }

  try {
    // Prepara os dados para salvar
    const updateData: any = {
      title,
      summary,
      content,
      type,
      published: status === "published",
      
      // CORREÇÃO 1: O nome no banco é 'featured', não 'isFeatured'
      featured: isFeatured, 
    }

    // Só atualiza a imagem se houve mudança
    if (coverImageUrl !== null || removeImage) {
      updateData.coverImage = coverImageUrl
    }

    // Salva no banco
    await prisma.post.update({
      where: { id: postId },
      data: updateData,
    })

    // CORREÇÃO 2: APAGUEI TODO O BLOCO DO CAROUSEL AQUI (que estava quebrando o site)

  } catch (error) {
    console.error(error)
    return { error: "Erro ao atualizar post." }
  }

  // Atualiza as páginas
  revalidatePath("/admin/posts")
  revalidatePath("/")
  revalidatePath("/noticias")
  
  redirect("/admin/posts")
}