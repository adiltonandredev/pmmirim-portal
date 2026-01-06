// src/app/actions/posts.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function deletePost(postId: string) {
  const session = await auth()
  
  // Qualquer EDITOR ou ADMIN pode gerenciar posts
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    throw new Error("Não autorizado")
  }

  try {
    await prisma.post.delete({
      where: { id: postId },
    })

    revalidatePath("/admin/posts")
    return { success: "Post excluído com sucesso!" }
  } catch (error) {
    return { error: "Erro ao excluir post." }
  }
}