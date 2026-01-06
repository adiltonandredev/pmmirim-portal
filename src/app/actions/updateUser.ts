// src/app/actions/updateUser.ts
"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateUser(formData: FormData) {
  // 1. Segurança
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Acesso negado." }
  }

  const userId = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as "ADMIN" | "EDITOR"
  const password = formData.get("password") as string

  try {
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

    revalidatePath("/admin")
    return { success: "Usuário atualizado com sucesso!" }

  } catch (error) {
    console.error(error)
    return { error: "Erro ao atualizar usuário." }
  }
}