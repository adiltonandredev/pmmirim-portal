"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { uploadImage } from "@/lib/upload"
import { logAdminAction } from "@/lib/audit" // 1. O Espião
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Helper para deletar arquivos físicos e economizar espaço no servidor
async function tryDeleteFile(path: string) {
    if (!path) return;
    try {
        const fullPath = join(process.cwd(), "public", path)
        if (existsSync(fullPath)) await unlink(fullPath)
    } catch (e) {
        console.error("Erro ao deletar arquivo físico:", e)
    }
}

export async function updatePost(formData: FormData) {
  try {
    const session = await auth()
    
    // Verifica permissão
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
      return { success: false, message: "Acesso negado. Apenas administradores e editores podem editar posts." }
    }

    // Pega os dados do formulário
    const postId = formData.get("id") as string
    if (!postId) {
        return { success: false, message: "ID do post não encontrado." }
    }

    const title = formData.get("title") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const type = formData.get("type") as any
    const status = formData.get("status") as string
    const isFeatured = formData.get("isFeatured") === "true"
    const removeImage = formData.get("removeImage") === "true"
    
    const coverImageFile = formData.get("coverImage") as File

    // Busca o post antigo para saber a imagem atual (para limpar o HD se necessário)
    const oldPost = await prisma.post.findUnique({ where: { id: postId } })

    // Lógica da imagem
    let coverImageUrl: string | null = null
    let imageChanged = false;

    if (removeImage) {
      coverImageUrl = null
      imageChanged = true;
      // Se mandou remover, apaga a antiga do HD
      if (oldPost?.coverImage) await tryDeleteFile(oldPost.coverImage);
      
    } else if (coverImageFile && coverImageFile.size > 0) {
      try {
        const uploadedPath = await uploadImage(coverImageFile)
        if (uploadedPath) {
            coverImageUrl = uploadedPath
            imageChanged = true;
            // Se fez upload de nova, apaga a antiga do HD
            if (oldPost?.coverImage) await tryDeleteFile(oldPost.coverImage);
        }
      } catch (error: any) {
        return { success: false, message: error.message || "Erro ao fazer upload da imagem" }
      }
    }

    // Prepara os dados para salvar
    const updateData: any = {
      title,
      summary,
      content,
      type,
      published: status === "published",
      featured: isFeatured, 
    }

    // Só atualiza a imagem no banco se houve mudança
    if (imageChanged) {
      updateData.coverImage = coverImageUrl
    }

    // Salva no banco
    await prisma.post.update({
      where: { id: postId },
      data: updateData,
    })

    // REGISTRA A EDIÇÃO NA AUDITORIA
    const typeName = type === "NEWS" ? "Notícia" : type === "EVENT" ? "Evento" : "Projeto";
    await logAdminAction("EDITOU", "Post", `Título: ${title} (${typeName})`)

    // Atualiza as páginas
    revalidatePath("/admin/posts")
    revalidatePath("/")
    revalidatePath("/noticias")
    
    // RETORNO PADRONIZADO (Sem redirect no backend)
    return { success: true, message: "Post atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar post:", error)
    return { success: false, message: "Erro interno ao atualizar post." }
  }
}