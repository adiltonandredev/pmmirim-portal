// src/app/actions/users.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth" // ou "../auth"
import { revalidatePath } from "next/cache"

export async function deleteUser(userId: string) {
  // 1. Segurança: Quem está tentando excluir?
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Não autorizado")
  }

  // 2. Segurança: Não deixe o admin excluir a si mesmo!
  if (session.user.id === userId) {
    return { error: "Você não pode excluir sua própria conta." }
  }

  try {
    // 3. Deleta o usuário do banco
    await prisma.user.delete({
      where: { id: userId },
    })

    // 4. Atualiza a tela do Admin automaticamente
    revalidatePath("/admin")
    return { success: "Usuário excluído com sucesso!" }
    
  } catch (error) {
    return { error: "Erro ao excluir usuário." }
  }
}