"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { logAdminAction } from "@/lib/audit" // <--- O Espião

export async function updateUser(formData: FormData) {
  try {
    // 1. Segurança
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, message: "Acesso negado. Apenas administradores podem editar usuários." }
    }

    const userId = formData.get("id") as string
    if (!userId) {
        return { success: false, message: "ID do usuário não fornecido." }
    }

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as "ADMIN" | "EDITOR"
    const password = formData.get("password") as string

    // 2. Monta o objeto de atualização
    const dataToUpdate: any = {
      name,
      email,
      role,
    }

    // 3. Só atualiza a senha se o admin digitou algo novo
    if (password && password.trim() !== "") {
      dataToUpdate.password = await hash(password, 10)
    }

    // 4. Salva no banco
    await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    })

    // 5. Log de Auditoria
    await logAdminAction("EDITOU", "Usuário do Sistema", `Nome: ${name} (${role})`)

    revalidatePath("/admin/usuarios") // Adicionei para garantir que a lista atualize
    revalidatePath("/admin")
    
    return { success: true, message: "Usuário atualizado com sucesso!" }

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, message: "Erro interno ao atualizar os dados do usuário." }
  }
}